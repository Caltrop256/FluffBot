// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */

const Discord = require('discord.js');
const config = require("../commands/json/config.json");
const fs = require('fs');
const smartTruncate = require('smart-truncate');
const { MessageAttachment } = require('discord.js');
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

const embedRed = 0xFC4B4B



module.exports = (client, reaction, user) => {

    let channel_id_color = "562328013371605012"; 
    let message_id_color = client.cfg.color1;

    let channel_id_color2 = "562328013371605012"; 
    let message_id_color2 = client.cfg.color2;

    let channel_id_other = "562328013371605012"; 
    let message_id_other = client.cfg.other1;

    let channel_id = "562586739819151370"; 
    let message_id = client.cfg.ruleAccept;
    
    if (user.bot) return;
    // Temporarily store guild.
    let guild = reaction.message.guild;
    guild.fetchMember(user)
        .then((addedByMember) => 
        { client.lastSeen(addedByMember, `Adding a reaction to a message in #${reaction.message.channel.name}`)
        })

    if((reaction.emoji.id == "562330233315917843" || reaction.emoji.id == "562330227322388485" || reaction.emoji.id == "586161821338042379" || reaction.emoji.id == "586161821551951882" || reaction.emoji.id == "586161821044441088") && guild !== null && guild !== undefined) {
        if(user.id == reaction.message.author.id) return reaction.remove(user.id)
        reactionMaster3000()
        async function reactionMaster3000() {
            var post = client.starboard.get(reaction.message.id)
            if(post) {
                var type = ""
                var msg = reaction.message
                var up = 0;
                var down = 0;
                var plat = 0;
                var gold = 0;
                var silver = 0;
                msg.reactions.forEach(r => {
                    switch(r.emoji.id) {
                        case "562330233315917843" :
                            up = r.users.size
                            type = "up"
                            break;
                        case "562330227322388485" :
                            down = r.users.size
                            type = "down"
                            break;
                        case "586161821338042379" :
                            plat = r.users.size
                            type = "plat"
                            break;
                        case "586161821551951882" :
                            gold = r.users.size
                            type = "gold"
                            break;
                        case "586161821044441088" :
                            silver = r.users.size
                            type = "silver"
                            break;
                    }
                })
                var obj = {
                    id: msg.id,
                    starboardid: post.starboardid,
                    upvotes: up,
                    downvotes: down,
                    plat: plat,
                    gold: gold,
                    silver: silver
                }
                client.handleKarmaObj(type, reaction.message.author.id, 1)
                
                var starboardChannel = client.channels.get(client.cfg.starboardChannel)
                if(up - down >= client.cfg.minStarboardScore) {
                    var upvoteEmoji = client.emojis.get("562330233315917843")
    
                    const embeds = msg.embeds;
                    const attachments = msg.attachments; 
            
                    let eURL = ''
            
                    if (embeds.length > 0) {
            
                    if(embeds[0].thumbnail && embeds[0].thumbnail.url)
                        eURL = embeds[0].thumbnail.url;
                    else if(embeds[0].image && embeds[0].image.url)
                        eURL = embeds[0].image.url;
                    else
                        eURL = embeds[0].url;
            
                    } else if (attachments.array().length > 0) {
                    const attARR = attachments.array();
                    eURL = attARR[0].url;
                    }
    
                    var Awards = ``
                    if(obj.plat > 0) {var platemoji = client.emojis.get("586161821338042379"); Awards += `${platemoji}x${obj.plat}\n`}
                    if(obj.gold > 0) {var goldemoji = client.emojis.get("586161821551951882"); Awards += `${goldemoji}x${obj.gold}\n`}
                    if(obj.silver > 0) {var silveremoji = client.emojis.get("586161821044441088"); Awards += `${silveremoji}x${obj.silver}\n`}
                    var starboardembed = new Discord.RichEmbed()
                    .setAuthor(msg.member.displayName, msg.author.displayAvatarURL, msg.url)
                    .setFooter(`Score: ${up - down}`, upvoteEmoji.url)
                    .setDescription(`[[Jump to Message](${msg.url})]`)
                    .setThumbnail(msg.author.displayAvatarURL)
                    .setImage(eURL)
                    .setTimestamp()
                    if(msg.content.length > 0) starboardembed.addField(`Content`, msg.content)
                    if(Awards.length > 0) starboardembed.addField("Awards", Awards)
                    if(msg.author.displayHexColor) {starboardembed.setColor(msg.author.displayHexColor)} else {starboardembed.setColor(0xFFD700)}
    
                    const canvas = Canvas.createCanvas(300, 300);
                    const ctx = canvas.getContext('2d');
                
                    const background = await Canvas.loadImage('./images/starboard_template.png');
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                
                    ctx.strokeStyle = '#FFD700';
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);
                
                    ctx.font = '128px sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`${up.toString()}`, canvas.width / 2, canvas.height / 2.6);
                
                    ctx.font = '128px sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`${down.toString()}`, canvas.width / 2, canvas.height / 1.07);

                    var randID = Math.floor(Math.random() * 10000)
                
                    starboardembed.thumbnail = {
                        url: `attachment://votes${randID}.png`
                    }
    
                    if(post.starboardid) {
                        console.log("edit post")
                        starboardChannel = client.channels.get(client.cfg.starboardChannel)
                        starboardChannel.fetchMessage(post.starboardid).then(message => {
                            message.delete(100)
                            starboardChannel.send({embed: starboardembed, files: [{attachment: canvas.toBuffer(), name: `votes${randID}.png`}]}).then(message => {
                                obj.starboardid = message.id
                                client.starboard.set(msg.id, obj)
                            });
                        })
                    } else {
                        console.log("new post")
                        starboardChannel = client.channels.get(client.cfg.starboardChannel)
                        starboardChannel.send({embed: starboardembed, files: [{attachment: canvas.toBuffer(), name: `votes${randID}.png`}]}).then(message => {
                            obj.starboardid = message.id
                            client.starboard.set(msg.id, obj)
                        })
                    }
                } else if(up - down < client.cfg.minStarboardScore && post.starboardid) {
                    starboardChannel = client.channels.get(client.cfg.starboardChannel)
                    starboardChannel.fetchMessage(post.starboardid).then(message => {
                        message.delete(200)
                        obj.starboardid = null
                        client.starboard.set(msg.id, obj)
                    })
                }
            } else {
                var msg = reaction.message
                var up = 0;
                var down = 0;
                var plat = 0;
                var gold = 0;
                var silver = 0;
                msg.reactions.forEach(r => {
                    switch(r.emoji.id) {
                        case "562330233315917843" :
                            up = r.users.size
                            type = "up"
                            break;
                        case "562330227322388485" :
                            down = r.users.size
                            type = "down"
                            break;
                        case "586161821338042379" :
                            plat = r.users.size
                            type = "plat"
                            break;
                        case "586161821551951882" :
                            gold = r.users.size
                            type = "gold"
                            break;
                        case "586161821044441088" :
                            silver = r.users.size
                            type = "silver"
                            break;
                    }
                })
                var obj = {
                    id: msg.id,
                    starboardid: null,
                    upvotes: up,
                    downvotes: down,
                    plat: plat,
                    gold: gold,
                    silver: silver
                }
                client.handleKarmaObj(type, reaction.message.author.id, 1)
                client.starboard.set(msg.id, obj)
            }
        }
    }
    

    if(reaction.emoji.name === "‼" && guild !== null && guild !== undefined) {
        reaction.remove(user)

        guild.fetchMember(user)
        .then((addedByMember) => 
        {
            if(addedByMember == reaction.message.member) {return reaction.message.reply("Please do not report your own Message.")}
            const embeds = reaction.message.embeds;
            const attachments = reaction.message.attachments; 
    
            let eURL = ''
    
            if (embeds.length > 0) {
    
            if(embeds[0].thumbnail && embeds[0].thumbnail.url)
                eURL = embeds[0].thumbnail.url;
            else if(embeds[0].image && embeds[0].image.url)
                eURL = embeds[0].image.url;
            else
                eURL = embeds[0].url;
    
            } else if (attachments.array().length > 0) {
                const attARR = attachments.array();
                eURL = attARR[0].url;
            }

            var reportSpecificationEmbed = new Discord.RichEmbed()
            .setAuthor("Please provide additional information")
            .setDescription(`You are about to report ${reaction.message.member}(\`${reaction.message.member.user.username}#${reaction.message.author.discriminator}\`), please specifiy which Rule they broke. You can view the Rules [here](https://discordapp.com/channels/562324876330008576/562328097827848242)\nAlternatively, you can react with ❌ to cancel the Report.`)
            .addField("🇦", `for Rule 1 (Bad Faith Participation and Civility)`, false)
            .addField("🇧", `for Rule 2 (Privacy)`, false)
            .addField("🇨", `for Rule 3 (Disruptive Behavior)`, false)
            .addField("🇩", `for Rule 4 (NSFW Content)`, false)
            .setColor()
            .setTimestamp(addedByMember.displayHexColor)
            .setFooter("This Report will automatically time out in 2 minutes.")

            addedByMember.send({embed: reportSpecificationEmbed}).then(async msg => {
                
                var reacted = ''

                await msg.react("🇦")
                await msg.react("🇧")
                await msg.react("🇨")
                await msg.react("🇩")
                await msg.react("❌")

                const VotingTime = 2 * 60000

                const reportSpecificationFilter = (reaction, user) => {
                    return reaction.emoji.name === '🇦' || reaction.emoji.name === '🇧' || reaction.emoji.name === '🇨' || reaction.emoji.name === '🇩' || reaction.emoji.name === '❌' && user.id === addedByMember.user.id;
                };
                msg.awaitReactions(reportSpecificationFilter, { max: 1, time: VotingTime, errors: ['time'] })
                    .then(collected => reportFunc(collected)).catch((error) => console.log(error))
            

                async function reportFunc(collected) {
                    reacted += "disabled"

                    var collection = collected.first()

                    var messageReactions = Array.from(collection.message.reactions)
                   

                    var maxReact = []


                    await messageReactions.forEach(async r =>{
                        await r.forEach(async reaction => {
                            if(reaction.count > 1) {
                                maxReact.push(reaction)
                            }
                        })
                    })
                    await msg.reactions.forEach(r => {
                        r.remove(client.user)
                    })

                    var WinningReaction = maxReact[0];

                    var reportID = -1;

                    if(WinningReaction.emoji.name == "🇦") {var reportID = 1}
                    if(WinningReaction.emoji.name == "🇧") {var reportID = 2}
                    if(WinningReaction.emoji.name == "🇨") {var reportID = 3}
                    if(WinningReaction.emoji.name == "🇩") {var reportID = 4}
                    if(WinningReaction.emoji.name == "❌") {var reportID = 100; return msg.channel.send("Your report has been cancelled.")}

                    console.log(reportID)

                    if(reaction.message.content.length > 0) {var ReportedContents = smartTruncate(reaction.message.content, 512);}
                    if(reaction.message.content.length < 1) {var ReportedContents = "`(The reported content only included attachments)`"}
                    var messageLink = `https://discordapp.com/channels/562324876330008576/${reaction.message.channel.id}/${reaction.message.id}` 

                    var reportEmbed = new Discord.RichEmbed()
                    .setAuthor("User Report", reaction.message.member.user.avatarURL, reaction.message.member.user.avatarURL)
                    .setDescription(`[Jump to message](${messageLink})`)
                    .setColor(embedRed)
                    .setThumbnail(reaction.message.member.user.avatarURL)
                    .addField("Reported User:", `${reaction.message.member}\n\`${reaction.message.member.user.username}#${reaction.message.author.discriminator}\`\n\`${reaction.message.member.id}\``, true)
                    .addField("Reported by", `${addedByMember}\n\`${addedByMember.user.username}#${addedByMember.user.discriminator}\`\n\`${addedByMember.id}\``, true)
                    .addField("Reported for", `Rule ${reportID}`, true)
                    .addField("Message contents", ReportedContents)
                    .setImage(eURL)
                    .setTimestamp();

                    var bot_logs = client.channels.get("562338340918001684");
                    let notifRole = reaction.message.guild.roles.get("580482521100320793");

                    bot_logs.send(notifRole , {embed: reportEmbed})

                }
                
                setTimeout(() => {
                    if(reacted.includes("disabled")) {return}
                    msg.channel.send("Your report timed out. Please re-submit your report and chose a valid choice.")
                }, VotingTime);
            })
            .catch(error => {
                console.error(`Could not send help DM to a user.\n`, error);
                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
            });
        })
    }
    if(reaction.message.guild) {
        if(reaction.message.guild.id == "562324876330008576" && reaction.emoji.id == "562330233315917843") {
            guild.fetchMember(user)
            .then((addedByMember) => {
                if(!addedByMember.roles.find(r => r.name === "Starboard_access")) {
                    reaction.remove(addedByMember)
                }
            })
        }
    }
    if(reaction.message.guild) {
        if(reaction.message.guild.id == "562324876330008576") {
            var platEmo = client.emojis.get("586161821338042379");
            var goldEmo = client.emojis.get("586161821551951882");
            var silverEmo = client.emojis.get("586161821044441088");

            if(reaction.emoji.id == "586161821338042379") {
                guild.fetchMember(user)
                .then((addedByMember) => {

                    let sql;

                    connection.query(`SELECT * FROM coins WHERE id = '${addedByMember.id}'`, (err, rows) => {
                        if(err) throw err;
                        
                        if(rows.length < 1) {
                            addedByMember.send(`You do not have enough ${client.cfg.curName} to give **Platinum** (0/${client.cfg.platinum})\n__Prices__:\n${platEmo} - ${client.cfg.platinum} ${client.cfg.curName}\n${goldEmo} - ${client.cfg.gold} ${client.cfg.curName}\n${silverEmo} - ${client.cfg.silver} ${client.cfg.curName}`)
                            .catch(error => {
                                console.error(`Could not send help DM to a user.\n`, error);
                                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                            });
                        } else {
                            let coins = rows[0].coins;
                            if(coins < parseInt(client.cfg.platinum)) {
                                reaction.remove(addedByMember)
                                return addedByMember.send(`You do not have enough ${client.cfg.curName} to give **Platinum** (${coins}/${client.cfg.platinum})\n__Prices__:\n${platEmo} - ${client.cfg.platinum} ${client.cfg.curName}\n${goldEmo} - ${client.cfg.gold} ${client.cfg.curName}\n${silverEmo} - ${client.cfg.silver} ${client.cfg.curName}`)
                                .catch(error => {
                                    console.error(`Could not send help DM to a user.\n`, error);
                                    receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                                });
                                }
                                sql = `UPDATE coins SET coins = ${coins - parseInt(client.cfg.platinum)} WHERE id = '${addedByMember.id}';`
                                client.addEntry(addedByMember.id, coins - parseInt(client.cfg.platinum), 104)
                                
                                connection.query(`SELECT * FROM premReward WHERE id = '${reaction.message.author.id}'`, (err, rows) => {
                                    if(err) throw err;

                                    if(rows.length < 1) {
                                        sql2 = `INSERT INTO premReward (id, silver, gold, plat) VALUES ('${reaction.message.author.id}', ${0}, ${0}, ${1});`
                                    } else {
                                        let plat = rows[0].plat;
                                        sql2 = `UPDATE premReward SET plat = ${plat + 1} WHERE id = '${reaction.message.author.id}';`
                                        
                                    }
                                    connection.query(sql, console.log)
                                    connection.query(sql2, console.log)
                                    addedByMember.send(`Succesfully given ${platEmo} to \`${reaction.message.member.displayName}\`\n\`${client.cfg.platinum} ${client.cfg.curName}\` have been deducted from your Account.`)
                                    .catch(error => {
                                        console.error(`Could not send help DM to a user.\n`, error);
                                        receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                                    });
                                })
                        }
                    
                    })

                })
            }
            if(reaction.emoji.id == "586161821551951882") {
                guild.fetchMember(user)
                .then((addedByMember) => {

                    var messageLink = `https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`

                    let sql;

                    connection.query(`SELECT * FROM coins WHERE id = '${addedByMember.id}'`, (err, rows) => {
                        if(err) throw err;
                        
                        if(rows.length < 1) {
                            addedByMember.send(`You do not have enough ${client.cfg.curName} to give **Gold** (0/${client.cfg.gold})\n__Prices__:\n${platEmo} - ${client.cfg.platinum} ${client.cfg.curName}\n${goldEmo} - ${client.cfg.gold} ${client.cfg.curName}\n${silverEmo} - ${client.cfg.silver} ${client.cfg.curName}`)
                            .catch(error => {
                                console.error(`Could not send help DM to a user.\n`, error);
                                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                            });
                        } else {
                            let coins = rows[0].coins;
                            if(coins < parseInt(client.cfg.gold)) {
                                reaction.remove(addedByMember)
                                return addedByMember.send(`You do not have enough ${client.cfg.curName} to give **Gold** (${coins}/${client.cfg.gold})\n__Prices__:\n${platEmo} - ${client.cfg.platinum} ${client.cfg.curName}\n${goldEmo} - ${client.cfg.gold} ${client.cfg.curName}\n${silverEmo} - ${client.cfg.silver} ${client.cfg.curName}`)
                                .catch(error => {
                                    console.error(`Could not send help DM to a user.\n`, error);
                                    receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                                });
                                }
                                sql = `UPDATE coins SET coins = ${coins - parseInt(client.cfg.gold)} WHERE id = '${addedByMember.id}';`
                                client.addEntry(addedByMember.id, coins - parseInt(client.cfg.gold), 104)
                                
                                connection.query(`SELECT * FROM premReward WHERE id = '${reaction.message.author.id}'`, (err, rows) => {
                                    if(err) throw err;

                                    if(rows.length < 1) {
                                        sql2 = `INSERT INTO premReward (id, silver, gold, plat) VALUES ('${reaction.message.author.id}', ${0}, ${1}, ${0});`
                                    } else {
                                        let gold = rows[0].gold;
                                        sql2 = `UPDATE premReward SET gold = ${gold + 1} WHERE id = '${reaction.message.author.id}';`
                                        
                                    }
                                    connection.query(sql, console.log)
                                    connection.query(sql2, console.log)
                                    addedByMember.send(`Succesfully given ${goldEmo} to \`${reaction.message.member.displayName}\`\n\`${client.cfg.gold} ${client.cfg.curName}\` have been deducted from your Account.`)
                                    .catch(error => {
                                        console.error(`Could not send help DM to a user.\n`, error);
                                        receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                                    });
                                })
                        }
                    
                    })

                })
            }
            if(reaction.emoji.id == "586161821044441088") {
                guild.fetchMember(user)
                .then((addedByMember) => {

                    let sql;

                    connection.query(`SELECT * FROM coins WHERE id = '${addedByMember.id}'`, (err, rows) => {
                        if(err) throw err;
                        
                        if(rows.length < 1) {
                            addedByMember.send(`You do not have enough ${client.cfg.curName} to give **Silver** (0/${client.cfg.silver})\n__Prices__:\n${platEmo} - ${client.cfg.platinum} ${client.cfg.curName}\n${goldEmo} - ${client.cfg.gold} ${client.cfg.curName}\n${silverEmo} - ${client.cfg.silver} ${client.cfg.curName}`)
                            .catch(error => {
                                console.error(`Could not send help DM to a user.\n`, error);
                                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                            });
                        } else {
                            let coins = rows[0].coins;
                            if(coins < parseInt(client.cfg.silver)) {
                                reaction.remove(addedByMember)
                                return addedByMember.send(`You do not have enough ${client.cfg.curName} to give **Silver** (${coins}/${client.cfg.silver})\n__Prices__:\n${platEmo} - ${client.cfg.platinum} ${client.cfg.curName}\n${goldEmo} - ${client.cfg.gold} ${client.cfg.curName}\n${silverEmo} - ${client.cfg.silver} ${client.cfg.curName}`)
                                .catch(error => {
                                    console.error(`Could not send help DM to a user.\n`, error);
                                    receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                                });
                                }
                                sql = `UPDATE coins SET coins = ${coins - parseInt(client.cfg.silver)} WHERE id = '${addedByMember.id}';`
                                client.addEntry(addedByMember.id, coins - parseInt(client.cfg.silver), 104)
                                
                                connection.query(`SELECT * FROM premReward WHERE id = '${reaction.message.author.id}'`, (err, rows) => {
                                    if(err) throw err;

                                    if(rows.length < 1) {
                                        sql2 = `INSERT INTO premReward (id, silver, gold, plat) VALUES ('${reaction.message.author.id}', ${1}, ${0}, ${0});`
                                    } else {
                                        let silver = rows[0].silver ;
                                        sql2 = `UPDATE premReward SET silver = ${silver + 1} WHERE id = '${reaction.message.author.id}';`
                                        
                                    }
                                    connection.query(sql, console.log)
                                    connection.query(sql2, console.log)
                                    addedByMember.send(`Succesfully given ${silverEmo} to \`${reaction.message.member.displayName}\`\n\`${client.cfg.silver} ${client.cfg.curName}\` have been deducted from your Account.`)
                                    .catch(error => {
                                        console.error(`Could not send help DM to a user.\n`, error);
                                        receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                                    });
                                })
                        }
                    
                    })

                })
            }
        }
    }


    // Check if the emoji is ✅ and if the reaction was a message from a guild.
    if(reaction.emoji.name === "✅" && guild !== null && guild !== undefined && reaction.message.id === message_id) 
    {
        reaction.message.clearReactions().then(() => {
            reaction.message.react("✅");
        });
        // DO NOT DIRECTLY USE message.member! This will return the author of the message instead of the person reaction.
        // We need to fetch the member that we need based on the User that we have.
        // So now we get the user:
        guild.fetchMember(user)
            .then((member) => 
            {
                let role = (member.guild.roles.find(role => role.name === "Welcome")) /* This should be the ID of the role, or a Role object from guild.roles. */;
                member.removeRole(role)
                .then(() => 
                {
                    console.log(`Removed role ${role} from ${member.displayName}`);
                }
                );
            });
    }

    if(user != user.bot && reaction.message.author != user.bot) {
        let calculateRandom = Math.floor(Math.random() * 100) + 1
        let randomNumber = calculateRandom
        if(randomNumber < 5 && reaction.emoji.name !== "‼") {
            try {reaction.message.react(reaction.emoji)
            } catch (error) {
                console.log(error)
            }
        }
    }
    
    if (user.bot) return;
    // Temporarily store guild.
    let colorguild = reaction.message.guild;


    const blackEmoji = client.emojis.find(emoji => emoji.name === "color_black");
    const greyEmoji = client.emojis.find(emoji => emoji.name === "color_grey");
    const mossEmoji = client.emojis.find(emoji => emoji.name === "color_moss");
    const bright_greenEmoji = client.emojis.find(emoji => emoji.name === "color_bright_green");
    const greenEmoji = client.emojis.find(emoji => emoji.name === "color_green");
    const neon_greenEmoji = client.emojis.find(emoji => emoji.name === "color_neon_green");
    const turqoiseEmoji = client.emojis.find(emoji => emoji.name === "color_turquoise");
    const aquaEmoji = client.emojis.find(emoji => emoji.name === "color_aqua");
    const cyanEmoji = client.emojis.find(emoji => emoji.name === "color_cyan");
    const tealEmoji = client.emojis.find(emoji => emoji.name === "color_teal");
    const sky_blueEmoji = client.emojis.find(emoji => emoji.name === "color_sky_blue");
    const blueEmoji = client.emojis.find(emoji => emoji.name === "color_blue");
    const ocean_blueEmoji = client.emojis.find(emoji => emoji.name === "color_ocean_blue");
    const ultramarineEmoji = client.emojis.find(emoji => emoji.name === "color_ultramarine");
    const dark_purpleEmoji = client.emojis.find(emoji => emoji.name === "color_dark_purple");
    const periwinkleEmoji = client.emojis.find(emoji => emoji.name === "color_periwinkle");
    const magentaEmoji = client.emojis.find(emoji => emoji.name === "color_magenta");
    const light_magentaEmoji = client.emojis.find(emoji => emoji.name === "color_light_magenta");
    const violetEmoji = client.emojis.find(emoji => emoji.name === "color_violet");
    const beigeEmoji = client.emojis.find(emoji => emoji.name === "color_beige");
    const peachEmoji = client.emojis.find(emoji => emoji.name === "color_peach");
    const pinkEmoji = client.emojis.find(emoji => emoji.name === "color_pink");
    const hot_pinkEmoji = client.emojis.find(emoji => emoji.name === "color_hot_pink");
    const neon_pinkEmoji = client.emojis.find(emoji => emoji.name === "color_neon_pink");
    const redEmoji = client.emojis.find(emoji => emoji.name === "color_red");
    const redderEmoji = client.emojis.find(emoji => emoji.name === "color_reder");
    const dark_orangeEmoji = client.emojis.find(emoji => emoji.name === "color_dark_orange");
    const perfect_orangeEmoji = client.emojis.find(emoji => emoji.name === "color_perfect_orange");
    const bright_orangeEmoji = client.emojis.find(emoji => emoji.name === "color_bright_orange");
    const orangeEmoji = client.emojis.find(emoji => emoji.name === "color_orange");
    const yellowEmoji = client.emojis.find(emoji => emoji.name === "color_yellow");
    const bright_yellowEmoji = client.emojis.find(emoji => emoji.name === "color_bright_yellow");
    const announcementEmoji = client.emojis.find(emoji => emoji.name === "Announcement_notif");

    var MajBlack = {Name: blackEmoji, RoleID: "562330104521555969"}
    var MajGrey = {Name: greyEmoji, RoleID: "562331500595642369"}
    var MajMoss = {Name: mossEmoji, RoleID: "562331565032472606"}
    var MajBright_Green = {Name: bright_greenEmoji, RoleID: "562331566743879805"}
    var MajNeon_Green = {Name: neon_greenEmoji, RoleID: "562331674549944321"}
    var MajGreen = {Name: greenEmoji, RoleID: "562331673941901332"}
    var MajTurquoise = {Name: turqoiseEmoji, RoleID: "562331675590131732"}
    var MajAqua = {Name: aquaEmoji, RoleID: "562331676210888714"}
    var MajCyan = {Name: cyanEmoji, RoleID: "562331676898754609"}
    var MajTeal = {Name: tealEmoji, RoleID: "562331677305602067"}
    var MajSky_Blue = {Name: sky_blueEmoji, RoleID: "562331678329274369"}
    var MajBlue = {Name: blueEmoji, RoleID: "562331678849368085"}
    var MajOcean_Blue = {Name: ocean_blueEmoji, RoleID: "562331679591497768"}
    var MajUltramarine = {Name: ultramarineEmoji, RoleID: "562331680262848522"}
    var MajDark_Purple = {Name: dark_purpleEmoji, RoleID: "562919504099672074"}
    var MajPeriwinkle = {Name: periwinkleEmoji, RoleID: "562332090532626433"}
    var MajMagenta = {Name: magentaEmoji, RoleID: "562332091178549269"}
    var MajLight_Magenta = {Name: light_magentaEmoji, RoleID: "562332092286107676"}
    var MajViolet = {Name: violetEmoji, RoleID: "562332092646817793"}
    var MajBeige = {Name: beigeEmoji, RoleID: "562332093321969695"}
    var MajPeach = {Name: peachEmoji, RoleID: "562332093879943179"}
    var MajPink = {Name: pinkEmoji, RoleID: "562332577193656342"}
    var MajHot_Pink = {Name: hot_pinkEmoji, RoleID: "562332577474674708"}
    var MajNeon_Pink = {Name: neon_pinkEmoji, RoleID: "562332578229649433"}
    var MajRed = {Name: redEmoji, RoleID: "562332578938617856"}
    var MajReder = {Name: redderEmoji, RoleID: "562332579085418497"}
    var MajDark_Orange = {Name: dark_orangeEmoji, RoleID: "562332851383828490"}
    var MajPerfect_Orange = {Name: perfect_orangeEmoji, RoleID: "562332852369358892"}
    var MajBright_Orange = {Name: bright_orangeEmoji, RoleID: "562332852474216572"}
    var MajOrange = {Name: orangeEmoji, RoleID: "562332853388574753"}
    var MajYellow = {Name: yellowEmoji, RoleID: "562332853396832264"}
    var MajBright_Yellow = {Name: bright_yellowEmoji, RoleID: "562332854206595085"}

    


    const RoleMajArray = [MajBlack, MajGrey, MajMoss, MajBright_Green, MajNeon_Green, MajGreen, MajTurquoise, MajAqua, MajCyan, MajTeal, MajSky_Blue, MajBlue, MajOcean_Blue, MajUltramarine, MajDark_Purple, MajPeriwinkle, MajMagenta, MajLight_Magenta, MajViolet, MajBeige, MajPeach, MajPink, MajHot_Pink, MajNeon_Pink, MajRed, MajReder, MajDark_Orange, MajPerfect_Orange, MajBright_Orange, MajOrange, MajYellow, MajBright_Yellow]

    for (var i = 0; i < RoleMajArray.length; i++) {
        if(reaction.message.id == message_id_color || reaction.message.id == message_id_color2 || reaction.message.id == message_id_other) {
            if(reaction.emoji == RoleMajArray[i].Name) {
                var currentMaj = RoleMajArray[i]
                var detectedRole = reaction.message.guild.roles.get(RoleMajArray[i].RoleID);
                reaction.message.guild.fetchMember(user).then(async (member) => {
                    
                    await member.addRole(detectedRole, "Role Selection: Automatically added selected Role to user")
                    var RemoveArray = []
                    await RoleMajArray.forEach(maj => {
                        if(maj.RoleID !== currentMaj.RoleID && member.roles.has(maj.RoleID)) {
                            var otherRole = reaction.message.guild.roles.get(maj.RoleID)
                            RemoveArray.push(otherRole)
                            console.log(console.color.magenta(`[Role-Selection]`), `Pushed "${otherRole.name}" to removeArray`)
                        }
                    })

                    try {member.removeRoles(RemoveArray, "Role Selection: Removed other / unselected Roles from user")}catch(error) {console.error(error)}

                    //reaction.remove(user)
                    client.channels.get(channel_id_color).fetchMessage(message_id_color).then(m => {
                        m.reactions.forEach(reaction => {
                            try {
                                if(reaction.emoji.name == currentMaj.Name.name) {
                                } else {reaction.remove(user)}
                            }catch(error) {console.error(error)}
                        })
                    })
                    client.channels.get(channel_id_color).fetchMessage(message_id_color2).then(m => {
                        m.reactions.forEach(reaction => {
                            try {
                                if(reaction.emoji.name == currentMaj.Name.name) {
                                } else {reaction.remove(user)}
                            }catch(error) {console.error(error)}
                        })
                    })
                    console.log(console.color.magenta(`[Role-Selection]`), `Added the "${detectedRole.name}" role to guildMember "${member.displayName}"`)
                })
            
                
            }
        }
    }

    if(reaction.emoji.name === "🗄" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) 
    {
        guild.fetchMember(user)
            .then((member) => 
            {
                let role = (member.guild.roles.find(role => role.name === "Archivist"));
                member.addRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                }
                );
            });
    }
    if(reaction.emoji.name === "🎮" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) 
    {
        guild.fetchMember(user)
            .then((member) => 
            {
                let role = (member.guild.roles.find(role => role.name === "Gamer"));
                member.addRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                }
                );
            });
    }
    if(reaction.emoji.name === "🎵" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) 
    {
        guild.fetchMember(user)
            .then((member) => 
            {
                let role = (member.guild.roles.find(role => role.name === "Music"));
                member.addRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                }
                );
            });
    }
    if(reaction.emoji.name === "🖊" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) 
    {
        guild.fetchMember(user)
            .then((member) => 
            {
                let role = (member.guild.roles.find(role => role.id == "607203938520793098"));
                member.addRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                }
                );
            });
    }
    if(reaction.emoji.name === "🌟" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) 
    {
        guild.fetchMember(user)
            .then((member) => 
            {
                let role = (member.guild.roles.find(role => role.name === "Starboard_access"));
                member.addRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                }
                );
            });
    }
    if(reaction.emoji.name === "🍔" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) 
    {
        guild.fetchMember(user)
            .then((member) => 
            {
                let role = (member.guild.roles.find(role => role.name === "Foodie"));
                member.addRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                }
                );
            });
    }
    if(reaction.emoji.id == announcementEmoji.id && guild !== null && guild !== undefined && reaction.message.id === message_id_other) 
    {
        guild.fetchMember(user)
            .then((member) => 
            {
                let role = (member.guild.roles.find(role => role.name === "Announcements"));
                member.addRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                }
                );
            });
    }

}