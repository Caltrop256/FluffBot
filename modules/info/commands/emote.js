'use strict';

const Discord = require('discord.js')
const fs = require('fs');
var mergeImg = require('merge-img')

const average = require('image-average-color');


module.exports = {
    name: 'emote',
    aliases: ['emoteinfo', 'aboutemote'],
    description: 'Shows information about an Emote',
    args: true,
    usage: '<:Emote:>',
    advUsage: 'The Bot must be in the same Guild as the emote.',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    async execute(client, args, message)
    {

        var emoteEmbed = new Discord.RichEmbed()

        var EmoteArray = []

        var emoteMatcher = message.content.match(/(?<=<:.*:)\d*/gim)
        if (emoteMatcher)
        {
            emoteMatcher.forEach((match, index) =>
            {
                if (match !== "")
                {
                    var emoteObject = client.emojis.get(match)
                    if (emoteObject)
                    {
                        EmoteArray.push(emoteObject.url)
                        var emoteAgeString = `${client.time(Date.now() - emoteObject.createdTimestamp, true)}`
                        emoteEmbed.addField(`:${emoteObject.name}:`, `Guild: \`${emoteObject.guild.name}\`\nCreated: \`${emoteAgeString.match(/.+?(?=(days \d))/gi)} days\` ago`)
                    } else
                    {
                        return message.reply(`Couldn't locate the ${client.scripts.oridnalSuffix(index)} emote.`)
                    }
                }
            })
        }
        var ID = Math.round(Math.random() * 10000)
        console.log(EmoteArray)
        if (EmoteArray.length < 1) return message.reply(`Couldn't locate any Emotes.`)
        mergeImg(EmoteArray)
            .then((img) =>
            {
                img.write(`./images/emoteMerge${ID}.png`, (err) =>
                {
                    if (err) throw err
                    const attachment = new Discord.Attachment(`./images/emoteMerge${ID}.png`, `emoteMerge${ID}.png`);

                    emoteEmbed.attachFile(attachment)
                    emoteEmbed.setImage(`attachment://emoteMerge${ID}.png`);

                    average(`./images/emoteMerge${ID}.png`, (err, color) =>
                    {
                        if (err) throw err;
                        var [red, green, blue, alpha] = color;
                        emoteEmbed.setColor(`#${client.scripts.rgbToHex([red, green, blue])}`)

                        message.channel.send({ embed: emoteEmbed }).then(() =>
                        {
                            fs.unlink(`./images/emoteMerge${ID}.png`, (err) =>
                            {
                                if (err) throw err;
                                console.log(`emoteMerge${ID}.png was deleted`);
                            });
                        });
                    })
                })
            });
    }
}


