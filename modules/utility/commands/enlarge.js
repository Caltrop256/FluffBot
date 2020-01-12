'use strict';
//dont continue without a good intoxicant of your choice

const Discord = require('discord.js')
const fs = require('fs');
const emoteList = require(process.env.tropbot + '/library/emoji.json');
var emoji = require('node-emoji')
var svg2img = require('svg2img');
var Jimp = require('jimp');
var mergeImg = require('merge-img')

module.exports = {
    name: 'enlarge',
    aliases: ['e', 'resize', 'beeg', 'scale'],
    description: 'Enlarges an emote or an image',
    args: true,
    usage: '<args> <:Emote: | image attachment | direct image link> <parameters>',
    advUsage: 'Provide either an emote, an image, or a direct link of what you want to resize / scale.\nIf no args are provided the bot will just display your image.\n\n**Resizing**:\n\nJust input your desired resolution, for example: `--prefcmd :smiley: 1024x720`\nIf no height value is provided it will just scale with the width.\n\n**Scaling:**\n\nThis will scale your image evenly, just input your scaling factor.\nExample: `--prefcmd :smiley: f2`. This will scale the smiley by a factor of 2.\n\n**Additional Parameters:**\n\n`-nn`: use Nearest Neighbor\n`-bl`: use Nearest Bilinear\n`-bc`: use Bicubic\n`-he`: use Hermite\n`-be`: use Bezier',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    async execute(client, args, message) {
        var JimpArray = []
        var operationid = Math.round(Math.random() * 10000)
        var useFactor = true
        var resizeMode = { method: Jimp.RESIZE_NEAREST_NEIGHBOR, name: "Nearest Neighbour" }

        if (args.join(" ").toLowerCase().includes("-nn")) resizeMode = { method: Jimp.RESIZE_NEAREST_NEIGHBOR, name: "Nearest Neighbour" }
        if (args.join(" ").toLowerCase().includes("-bl")) resizeMode = { method: Jimp.RESIZE_BILINEAR, name: "Bilinear" }
        if (args.join(" ").toLowerCase().includes("-bc")) resizeMode = { method: Jimp.RESIZE_BICUBIC, name: "Bicubic" }
        if (args.join(" ").toLowerCase().includes("-he")) resizeMode = { method: Jimp.RESIZE_HERMITE, name: "Hermite" }
        if (args.join(" ").toLowerCase().includes("-be")) resizeMode = { method: Jimp.RESIZE_BEZIER, name: "Bezier" }

        const embeds = message.embeds;
        const attachments = message.attachments;
        let eURL = ''

        if (embeds.length > 0) {

            if (embeds[0].thumbnail && embeds[0].thumbnail.url)
                eURL = embeds[0].thumbnail.url;
            else if (embeds[0].image && embeds[0].image.url)
                eURL = embeds[0].image.url;
            else
                eURL = embeds[0].url;

        } else if (attachments.array().length > 0) {
            const attARR = attachments.array();
            eURL = attARR[0].url;
        }

        var dimensionsArgs = (" " + args.join(" ")).match(/([x ]\d*)/gi)
        if (dimensionsArgs) {
            while (dimensionsArgs[0] == " ") {
                dimensionsArgs.shift()
            }
        }
        var factorArg = args.join(" ").match(/\b(f\d*)/gi)
        var linkArg = args.join(" ").match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpe?g|gif|png)/gi)
        if (dimensionsArgs && dimensionsArgs[0] !== " " && dimensionsArgs.length > 0) {
            var dim1 = parseInt(dimensionsArgs[0].replace(/[^\d]/gi, ""))
            var dim2 = dimensionsArgs[1] ? parseInt(dimensionsArgs[1].replace(/[^\d]/gi, "")) : Jimp.AUTO
            if (isNaN(dim1) || isNaN(dim2)) return message.reply(`Invalid resize resolution`)
            useFactor = false
        } else if (factorArg) {
            var f = parseInt(factorArg[0].replace(/[^\d]/gi, ""))
            if (isNaN(f) || f > 10 || Math.sign(f) < 0) return message.reply(`Invalid factor size`)
        } else {
            var f = 1
        }

        var customMatch = args.join(" ").match(/(?<=<a?:.*:)\d*(?=>)/gi)
        var uniMatch = message.cleanContent.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)

        var cml = customMatch ? customMatch.length : 0
        var uml = uniMatch ? uniMatch.length : 0
        var lal = linkArg ? linkArg.length : 0

        async function scaleImg(image, factor) {
            var resized = image.scale(parseInt(factor), resizeMode.method);
            var extension = resized.getExtension();
            var randID = Math.floor(Math.random() * 10000)
            resized.write(`./images/resize${randID}.${extension}`, (err) => {
                JimpArray.push(`./images/resize${randID}.${extension}`);
            });
        }
        async function resizeImg(image, dim1, dim2) {
            var resized = image.resize(parseInt(dim1), parseInt(dim2), resizeMode.method);
            var extension = resized.getExtension();
            var randID = Math.floor(Math.random() * 10000)
            resized.write(`./images/resize${randID}.${extension}`, (err) => {
                JimpArray.push(`./images/resize${randID}.${extension}`);
            });
        }

        if (customMatch) {
            customMatch.forEach(async cm => {
                await Jimp.read(`https://cdn.discordapp.com/emojis/${cm}.gif`)
                    .then(animatedImage => {
                        if (useFactor) {
                            scaleImg(image, f)
                        } else {
                            resizeImg(animatedImage, dim1, dim2)
                        }
                    })
                    .catch(async err => {
                        await Jimp.read(`https://cdn.discordapp.com/emojis/${cm}.png`)
                            .then(image => {
                                if (useFactor) {
                                    scaleImg(image, f)
                                } else {
                                    resizeImg(image, dim1, dim2)
                                }
                            })
                            .catch(err => {
                                return message.reply('Couldn`t resolve the image from your Emote.')
                            });
                    });
            })
        }
        if (uniMatch) {
            uniMatch.forEach(async um => {
                var m = um
                var tempObj = emoji.find(m)
                var emote = emoteList.emojis.find(e => e.name.toLowerCase() == tempObj.key.toLowerCase())
                if (!emote) return;
                await svg2img(emote.url, async function (error, buffer) {
                    await Jimp.read(buffer)
                        .then(image => {
                            if (useFactor) {
                                scaleImg(image, f)
                            } else {
                                resizeImg(image, dim1, dim2)
                            }
                        })
                        .catch(err => {
                            return message.reply('Couldn`t resolve the image from your Emote.')
                        });
                });
            })
        }
        if (eURL) {
            await Jimp.read(eURL)
                .then(image => {
                    if (useFactor) {
                        scaleImg(image, f)
                    } else {
                        resizeImg(image, dim1, dim2)
                    }
                }).catch((err) => {
                    return message.reply('Couldn`t resolve the image from your Attachment.')
                })
        }
        if (linkArg) {
            await Jimp.read(linkArg[0])
                .then(image => {
                    if (useFactor) {
                        scaleImg(image, f)
                    } else {
                        resizeImg(image, dim1, dim2)
                    }
                }).catch((err) => {
                    return message.reply('Couldn`t resolve the image from your Link.')
                })
        }
        setTimeout(() => {
            setTimeout(() => {
                if (JimpArray.length > 1) {
                    if (!useFactor && !isNaN(dim2)) {
                        if (dim1 / dim2 > 1) { mergedir = true } else mergedir = false
                    } else mergedir = false
                    mergeImg(JimpArray, { direction: mergedir })
                        .then((image) => {
                            image.write(`./images/merge${operationid}.png`, (err) => {
                                if (err) throw err
                                const attachment = new Discord.Attachment(`./images/merge${operationid}.png`, `merge${operationid}.png`);
                                var resizeEmbed = new Discord.RichEmbed()
                                    .setTimestamp()
                                    .setColor(message.member.displayHexColor)
                                    .attachFile(attachment)
                                    .setImage(`attachment://merge${operationid}.png`)
                                if (useFactor) { resizeEmbed.setAuthor(`Image scaled`, message.author.avatarURL) } else resizeEmbed.setAuthor(`Image resized`, message.author.avatarURL)
                                if (useFactor) { resizeEmbed.setFooter(`Scaled with a factor of f${f} using ${resizeMode.name}`) } else resizeEmbed.setFooter(`resized to ${dim1}x${dim2} using ${resizeMode.name}`)

                                message.channel.send({ embed: resizeEmbed }).then(() => {
                                    fs.unlink(`./images/merge${operationid}.png`, (err) => {
                                        if (err) throw err;
                                        console.log(`merge${operationid}.png was deleted`);
                                        JimpArray.forEach(img => {
                                            fs.unlink(img, (err) => {
                                                if (err) throw err;
                                                console.log(`${img} was deleted`);
                                            })
                                        });
                                    });
                                })
                            })
                        })

                } else if (JimpArray.length == 1) {
                    const attachment = new Discord.Attachment(JimpArray[0], JimpArray[0].replace(`./images/`, ""));
                    var resizeEmbed = new Discord.RichEmbed()
                        .setTimestamp()
                        .setColor(message.member.displayHexColor)
                        .attachFile(attachment)
                        .setImage(`attachment://resize${operationid}.png`)
                    if (useFactor) { resizeEmbed.setAuthor(`Image scaled`, message.author.avatarURL) } else resizeEmbed.setAuthor(`Image resized`, message.author.avatarURL)
                    if (useFactor) { resizeEmbed.setFooter(`Scaled with a factor of f${f} using ${resizeMode.name}`) } else resizeEmbed.setFooter(`resized to ${dim1}x${dim2} using ${resizeMode.name}`)

                    message.channel.send({ embed: resizeEmbed }).then(() => {
                        JimpArray.forEach(img => {
                            fs.unlink(img, (err) => {
                                if (err) throw err;
                                console.log(`${img} was deleted`);
                            })
                        });
                    });
                } else return message.reply(`You must specify 1 or more emotes or images or links`)
            }, lal + uml + cml * 1000);
        }, 1000);
    }
};