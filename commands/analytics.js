const Discord = require('discord.js');
const config = require("./json/config.json");
var mysql = require('mysql');
if(config.maintenance == false) {
    var connection = mysql.createConnection({
        host     : `localhost`,
        port     : `3306`,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}else {
    var connection = mysql.createConnection({
        host     : config.mySQLHost,
        port     : config.mySQLPort,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}


module.exports = {
    name: 'analytics',
    aliases: ['anal'],
    description: 'Displays the amount of times a Command has been used',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: 1,
        duration: 20,
        maxUsers: 1
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        receivedMessage.react("😏")

        var reqPage = arguments[0] ? parseInt(arguments[0]) : 1
        if(isNaN(reqPage) || reqPage <= 0) reqPage = 1

        const { commands } = receivedMessage.client;
        var cmds = commands.array()


        connection.query(`SELECT * FROM cmdanal`, async (err, rows) => {
            if(err) return receivedMessage.reply(`Error: ${err}`)
            cmds.forEach((cmd, index) => {
                var foundcmd = rows.find(r => r.cmdname == cmd.name)
                cmds[index].uses = foundcmd ? foundcmd.uses : 0
            })

            var leaderboardEmbed = new Discord.RichEmbed()
            .setAuthor(`Anal for all ${cmds.length} commands!`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
            .setDescription(`Below you will find use analytics for every command.`)
            .setColor(0x74B979)
            .setThumbnail(receivedMessage.guild.iconURL.replace(/jpg$/g, "gif"))
            
            var LeaderBoard = ''
            maxLength = 24
            await cmds.forEach((cmds, index) => {
                if(index % 2) {
                    LeaderBoard += `${cmds.name.padEnd(maxLength, " -")} ${cmds.uses}\n`
                } else LeaderBoard += `${cmds.name.padEnd(maxLength, "- ")} ${cmds.uses}\n`
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
            leaderboardEmbed.addField(`Page ${reqPage}`, `\`\`\`${chunkArray[reqPage-1].content.join("\n")}\`\`\``)
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
                                    value: `\`\`\`${chunkArray[reqPage-1].content.join("\n")}\`\`\``
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
        })
    }
}