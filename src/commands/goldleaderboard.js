const Discord = require('discord.js');
const config = require("./json/config.json");
const fs = require('fs');
const ms = require('ms');
const translate = require('google-translate-api');
const prettyMs = require('pretty-ms');
var ordinal = require('ordinal-number-suffix')
var NumAbbr = require('number-abbreviate')
var numAbbr = new NumAbbr()
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

const embedPerfect_Orange = 0xFF7D00 
const embedGreen = 0x74B979

module.exports = {
    name: 'goldleaderboard',
    aliases: ['rewardsleaderboard', 'gold', 'silver', 'plat'],
    description: 'Displays the most rewarded members',
    args: false,
    usage: 'Limit',
    guildOnly: false,
    rateLimit: {
        usages: 1,
        duration: 12,
        maxUsers: 4
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage, primaryCommand) {
		var reqPage = arguments[0] ? parseInt(arguments[0]) : 1
        if(isNaN(reqPage) || reqPage <= 0) reqPage = 1
		
		if(primaryCommand == "gold" || primaryCommand == "plat" || primaryCommand == "silver") {var orderBy = primaryCommand}
		else {var orderBy = "gold"}



        connection.query(`SELECT * FROM premReward ORDER BY ${orderBy} DESC;`, async (err, rows) => {
            if(err) throw err;

            var leaderboardEmbed = new Discord.RichEmbed()
            .setAuthor(`Top ${rows.length} most rewarded Members`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
            .setDescription(`Below you will find a list of ${receivedMessage.guild.name} ${rows.length} most rewarded Members`)
            .setColor(0x74B979)
            .setThumbnail(receivedMessage.guild.iconURL.replace(/jpg$/g, "gif"))
            
            var LeaderBoard = ''

			var platEmo = client.emojis.get("586161821338042379");
			var goldEmo = client.emojis.get("586161821551951882");
            var silverEmo = client.emojis.get("586161821044441088");
            
            var maxLength = 32

            await rows.forEach((row, index) => {
                var rowMember = receivedMessage.guild.members.get(row.id)
                if(rowMember) {
                    if(index % 2) {
                        LeaderBoard += `\`${ordinal(rows.indexOf(row) + 1)}:\` ${rowMember.displayName.padEnd(maxLength, "- ")} \`${numAbbr.abbreviate(row.silver, 1)}\` ${silverEmo}, \`${numAbbr.abbreviate(row.gold, 1)}\` ${goldEmo}, \`${numAbbr.abbreviate(row.plat, 1)}\` ${platEmo}\n`.replace(rowMember.displayName, rowMember.toString())
                    } else LeaderBoard += `\`${ordinal(rows.indexOf(row) + 1)}:\` ${rowMember.displayName.padEnd(maxLength, " -")} \`${numAbbr.abbreviate(row.silver, 1)}\` ${silverEmo}, \`${numAbbr.abbreviate(row.gold, 1)}\` ${goldEmo}, \`${numAbbr.abbreviate(row.plat, 1)}\` ${platEmo}\n`.replace(rowMember.displayName, rowMember.toString())
                }
            })

            var LeaderboardArray = LeaderBoard.split('\n')
            LeaderboardArray.length = LeaderboardArray.length - 1
            var chunkArray = [];
            var step = 1
            while (LeaderboardArray.length > 0) {
                chunk = LeaderboardArray.splice(0, 5)
                chunkArray.push({page: step, content: chunk})
                step++
              }
            if(reqPage > chunkArray.length) return receivedMessage.reply(`Please choose a number between 1 and ${chunkArray.length} as a page.`)
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
        })
    }
}