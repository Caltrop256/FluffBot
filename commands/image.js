const Discord = require('discord.js');
const GoogleImages = require('google-images');
const config = require("./json/config.json");
const cse = new GoogleImages(config.gToken1, 'AIzaSyB_EQsTT_1rjEKuB1ml279g1VDk03Kvpn4');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'image',
    aliases: ['i'],
    description: 'Searches Google-Images for a string',
    args: true,
    usage: '<thing to search for>',
    guildOnly: true,
    rateLimit: {
        usages: 1,
        duration: 30,
        maxUsers: 2
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

execute(client, arguments, receivedMessage) {
    
        cse.search(arguments.join(" "), {safe: 'high'}).then(images => {
            if(images.length <= 0) return receivedMessage.reply(`Couldn't find any images for your search query`)
            var curImage = 0

            var embed = new Discord.RichEmbed()
            .setAuthor(`Image Search`, receivedMessage.author.avatarURL)
            .setTitle(arguments.join(" "))
            .setDescription(`**Resolution**: ${images[curImage].width}x${images[curImage].height}`)
            .setImage(images[curImage].url)
            .setFooter(`Image ${curImage+1} of ${images.length}`)
            .setColor(receivedMessage.member.displayHexColor)

            receivedMessage.channel.send({embed: embed}) .then(async function (message) {
                await message.react("⏪")
                await message.react("⬅")
                await message.react("⏹")
                await message.react("🔀")
                await message.react("➡")
                await message.react("⏩")
                const filter = (reaction, user) => {
                    return !user.bot;
                };
                const collector = message.createReactionCollector(filter, { time: 300000 });

                collector.on('collect', (reaction, reactionCollector) => {
                    receivedMessage.guild.fetchMember(reaction.users.last()).then(addedByMember => {
                        reaction.remove(addedByMember)
                        if(addedByMember.user.id == receivedMessage.author.id) {
                            const editImage = function(curImage) {
                                embed.setDescription(`**Resolution**: ${images[curImage].width}x${images[curImage].height}`)
                                embed.setImage(images[curImage].url)
                                embed.setFooter(`Image ${curImage+1} of ${images.length}`)
                                message.edit({embed: embed})
                            }
                            switch(reaction.emoji.name) {
                                case "⬅" :
                                    if(curImage-1 < 0) return;
                                    curImage -= 1
                                    editImage(curImage)
                                    break;
                                case "➡" :
                                    if(curImage+2 > images.length) return;
                                    curImage += 1
                                    editImage(curImage)
                                    break;
                                case "⏹" :
                                    reactionCollector.stop()
                                    break;
                                case "🔀" :
                                    curImage = Math.floor(Math.random() * images.length-1) + 1
                                    editImage(curImage)
                                    break;
                                case "⏩" :
                                    curImage += 10
                                    if(curImage > images.length-1) curImage = images.length-1
                                    editImage(curImage)
                                    break;
                                case "⏪" :
                                    curImage -= 10
                                    if(curImage < 0) curImage = 0
                                    editImage(curImage)
                                    break;
                            }
                        }
                    })
                })
                collector.on('end', (reaction, reactionCollector) => {
                    message.clearReactions()
                })

            })
        })
    }
}