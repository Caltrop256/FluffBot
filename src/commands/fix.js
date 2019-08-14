const Discord = require('discord.js');
const fs = require('fs');
const Canvas = require('canvas');

module.exports = {
    name: 'fix',
    aliases: ['starboard'],
    description: 'Fixes a message if it isn\'t already on starboard but should',
    args: true,
    usage: '<link to message>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

async execute(client, arguments, receivedMessage) {

        specifiedChannel = client.channels.get(client.cfg.starboardChannel)
        var limit = Infinity

        var ogURL = arguments[0].match(/\/(\d)+/gi)
        if(ogURL) {
            if(ogURL.length !== 3) return receivedMessage.reply(`Invalid message url`)
        } else return receivedMessage.reply(`Invalid message url`)

        messageFetcher3000(specifiedChannel, limit)

        async function messageFetcher3000(specifiedChannel, limit) {
            var hrstart = process.hrtime()

            const sum_messages = [];
            let last_id;
        
            while (true) {
                const options = { limit: 100, before: receivedMessage.id};
                if (last_id) {
                    options.before = last_id;
                }
        
                const messages = await specifiedChannel.fetchMessages(options);
                sum_messages.push(...messages.array());
                last_id = messages.last().id;
        
                if (messages.size != 100) {
                    break;
                }
                if(sum_messages.length > limit) {
                    break;
                }
            }
            console.log(sum_messages.length)

            let tropbotmsgs = sum_messages.filter(msg => msg.author.id == "559411424590299149")

            console.log(tropbotmsgs.length)

            var starboardid = ``

            tropbotmsgs.forEach(msg => {
                if(msg.embeds[0]) {
                    var embed = msg.embeds[0]
                    if(embed.description) {
                        var urlMatch = embed.description.match(/\/(\d)+/gi)
                        if(urlMatch) {
                            if(urlMatch.length == 3) {
                                if(urlMatch[1].replace("/", "") == ogURL[1].replace("/", "") && urlMatch[2].replace("/", "") == ogURL[2].replace("/", "")) {
                                    starboardid = msg.id
                                }
                            }
                        }
                    }
                }
            })
            console.log(starboardid)

        
            var msgchannel = client.channels.get(ogURL[1].replace("/", ""))
            msgchannel.fetchMessage(ogURL[2].replace("/", "")).then(async msg => {
                var up = 0;
                var down = 0;
                var plat = 0;
                var gold = 0;
                var silver = 0;
                msg.reactions.forEach(r => {
                    switch(r.emoji.id) {
                        case "562330233315917843" :
                            up = r.count
                            break;
                        case "562330227322388485" :
                            down = r.count
                            break;
                        case "586161821338042379" :
                            plat = r.count
                            break;
                        case "586161821551951882" :
                            gold = r.count
                            break;
                        case "586161821044441088" :
                            silver = r.count
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
                    if(starboardid !== "") {
                        starboardChannel = client.channels.get(client.cfg.starboardChannel)
                        starboardChannel.fetchMessage(starboardid).then(message => {
                            message.delete(100)
                            starboardChannel.send({embed: starboardembed, files: [{attachment: canvas.toBuffer(), name: `votes${randID}.png`}]}).then(message => {
                                //message.attachments.first().setFile(canvas.toBuffer(), `votes${randID}.png`);
                                obj.starboardid = message.id
                                client.starboard.set(msg.id, obj)
                                receivedMessage.channel.send(`Successfully edited the message to starboard`)
                            });
                        })
                    } else {
                        starboardChannel = client.channels.get(client.cfg.starboardChannel)
                        starboardChannel.send({embed: starboardembed, files: [{attachment: canvas.toBuffer(), name: `votes${randID}.png`}]}).then(message => {
                            //message.attachments.first().setFile(canvas.toBuffer(), `votes${randID}.png`);
                            obj.starboardid = message.id
                            client.starboard.set(msg.id, obj)
                            receivedMessage.channel.send(`Successfully added the message to starboard`)
                        })
                    }
                } else if(up - down < client.cfg.minStarboardScore && starboardid !== "") {
                    starboardChannel = client.channels.get(client.cfg.starboardChannel)
                    starboardChannel.fetchMessage(starboardid).then(message => {
                        message.delete(200)
                        obj.starboardid = null
                        client.starboard.set(msg.id, obj)
                        receivedMessage.channel.send(`Deleted the starboard message because it didnt reach the minimum score`)
                    })
                } else {receivedMessage.reply(`Your message is not eligible for starboard.`)}

            })
        
        }
    }
}