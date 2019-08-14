const Discord = require('discord.js');
const smartTruncate = require('smart-truncate');
const prettyMs = require('pretty-ms');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'roles',
    aliases: ['rolesize'],
    description: 'Shows all roles and how many users have that role',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 60,
        maxUsers: 2
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    async execute(client, arguments, receivedMessage) {

        var reqPage = arguments[0] ? parseInt(arguments[0]) : 1
        if(isNaN(reqPage) || reqPage <= 0) reqPage = 1

        var roles = receivedMessage.guild.roles.array()
        roles = roles.sort((a,b) => a.calculatedPosition - b.calculatedPosition).reverse()

        var leaderboardEmbed = new Discord.RichEmbed()
        .setAuthor(`All ${roles.size} roles`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
        .setDescription(`Below you will find a list of ${receivedMessage.guild.name} ${roles.size} roles and how many Members are in that role.`)
        .setColor(0x74B979)
        .setThumbnail(receivedMessage.guild.iconURL.replace(/jpg$/g, "gif"))
        
        var LeaderBoard = ''
        maxLength = 32
        await roles.forEach((role, index) => {
            if(index % 2) {
                LeaderBoard += `${role.name.padEnd(maxLength, " -")} **${role.members.size}**\n`.replace(role.name, role.toString())
            } else LeaderBoard += `${role.name.padEnd(maxLength, "- ")} **${role.members.size}**\n`.replace(role.name, role.toString())
        })

        var LeaderboardArray = LeaderBoard.split('\n')
        LeaderboardArray.length = LeaderboardArray.length - 1
        var chunkArray = [];
        var step = 1
        while (LeaderboardArray.length > 0) {
            chunk = LeaderboardArray.splice(0, 10)
            chunkArray.push({page: step, content: chunk})
            step++
          }
        if(reqPage > chunkArray.length) reqPage = chunkArray.length
        leaderboardEmbed.addField(`Page ${reqPage}`, chunkArray[reqPage-1].content)
        leaderboardEmbed.setFooter(`Page ${reqPage}/${chunkArray.length}`)


        receivedMessage.channel.send({embed: leaderboardEmbed}).then(async function (message) {
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
                        const editImage = function(reqPage) {
                            
                            leaderboardEmbed.fields[0] = {
                                name: `Page ${reqPage}`,
                                value: chunkArray[reqPage-1].content.join("\n")
                            }
                            leaderboardEmbed.setFooter(`Page ${reqPage}/${chunkArray.length}`)
                            message.edit({embed: leaderboardEmbed})
                        }
                        switch(reaction.emoji.name) {
                            case "⬅" :
                                if(reqPage-1 < 1) return;
                                reqPage -= 1
                                editImage(reqPage)
                                break;
                            case "➡" :
                                if(reqPage+1 > chunkArray.length) return;
                                reqPage += 1
                                editImage(reqPage)
                                break;
                            case "⏹" :
                                reactionCollector.stop()
                                break;
                            case "🔀" :
                                reqPage = Math.floor(Math.random() * chunkArray.length) + 1
                                editImage(reqPage)
                                break;
                            case "⏩" :
                                reqPage += 10
                                if(reqPage > chunkArray.length) reqPage = chunkArray.length
                                editImage(reqPage)
                                break;
                            case "⏪" :
                                reqPage -= 10
                                if(reqPage < 0) reqPage = 1
                                editImage(reqPage)
                                break;
                        }
                    }
                })
            })
            collector.on('end', (reaction, reactionCollector) => {
                message.clearReactions()
            })
        })

    }
}


