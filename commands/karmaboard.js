const Discord = require('discord.js');
const config = require("./json/config.json");
var ordinal = require('ordinal-number-suffix')
const Canvas = require('canvas');
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
    name: 'karmaboard',
    aliases: ['karmaleaderboard', 'upvotes', 'downvotes'],
    description: 'Displays the user with the most karma',
    args: false,
    usage: 'page',
    guildOnly: true,
    rateLimit: {
        usages: 3,
        duration: 12,
        maxUsers: 4
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage, primaryCommand) {
		
        var reqPage = arguments[0] ? parseInt(arguments[0]) : 1
        if(isNaN(reqPage) || reqPage <= 0) reqPage = 1


        connection.query(`SELECT * FROM karma ORDER BY up DESC;`, async (err, rows) => {
            if(err) throw err;
            var totalUp = 0
            var totalDown = 0
            rows.forEach(row => {
                totalUp += row.up; totalDown += row.down;
            })
            rows = rows.sort((a, b) => (a.up - a.down) - (b.up - b.down)).reverse()

            var leaderboardEmbed = new Discord.RichEmbed()
            .setAuthor(`Karma Leaderboard`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
            .setDescription(`Karma is calculated by subtracting your amount of downvotes of your amount of upvotes`)
            .setColor(0xFFD700)
            .setTimestamp();
            
            var LeaderBoard = ''

            function numComma(x) {
                var parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");
            }
            var maxLength = 0;
            rows.forEach(row => {
                var rowMember = receivedMessage.guild.members.get(row.id)
                if(rowMember) {
                    if(rowMember.displayName.toString().length > maxLength) maxLength = rowMember.displayName.toString().length
                }
            })
            maxLength = 32

            rows.forEach(async (row, index) => {
                var rowMember = receivedMessage.guild.members.get(row.id)
                if(rowMember) {
                    var upvote = client.emojis.get("562330233315917843")
                    if(index % 2) {
                        LeaderBoard += `\`${ordinal(rows.indexOf(row) + 1)}:\` ${rowMember.displayName.padEnd(maxLength, " -")} ${upvote}**${numComma(row.up - row.down)}**\n`.replace(rowMember.displayName, rowMember.toString())
                    } else LeaderBoard += `\`${ordinal(rows.indexOf(row) + 1)}:\` ${rowMember.displayName.padEnd(maxLength, "- ")} ${upvote}**${numComma(row.up - row.down)}**\n`.replace(rowMember.displayName, rowMember.toString())    
                }
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
            if(reqPage > chunkArray.length) return receivedMessage.reply(`Please choose a number between 1 and ${chunkArray.length} as a page.`)
            leaderboardEmbed.addField(`Page ${reqPage}`, chunkArray[reqPage-1].content)
            leaderboardEmbed.setFooter(`Page ${reqPage}/${chunkArray.length}`)

            const canvas = Canvas.createCanvas(300, 300);
            const ctx = canvas.getContext('2d');

            const applyText = (canvas, text) => {
                let fontSize = 120;
                do {
                    ctx.font = `${fontSize -= 10}px sans-serif`;
                } while (ctx.measureText(text).width > canvas.width / 1.7);
                return ctx.font;
            };
        
            const background = await Canvas.loadImage('./images/starboard_template.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
            ctx.strokeStyle = '#FFD700';
            ctx.strokeRect(0, 0, canvas.width, `${totalUp}`);

            ctx.font = applyText(canvas, totalUp)
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${totalUp}`, canvas.width / 2.4, canvas.height / 2.6);

            ctx.font = applyText(canvas, `${totalDown}`)
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${totalDown}`, canvas.width / 2.4, canvas.height / 1.07);

            leaderboardEmbed.thumbnail = {
                url: "attachment://votes.png"
            }
        
            receivedMessage.channel.send({
                embed: leaderboardEmbed,
                files: [{
                attachment:canvas.toBuffer(),
                name:'votes.png'
                }]
            }).then(async function (message) {
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