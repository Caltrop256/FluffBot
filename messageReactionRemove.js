// messageReactionRemove
/* Emitted whenever a reaction is removed from a message.
PARAMETER              TYPE                   DESCRIPTION
messageReaction        MessageReaction        The reaction object
user                   User                   The user that removed the emoji or reaction emoji     */
const Discord = require('discord.js');
const config = require("../commands/json/config.json");
const fs = require('fs');
const prettyMs = require('pretty-ms');
const { MessageAttachment } = require('discord.js');
const ms = require('ms');
const { RichEmbed } = require('discord.js');
const Canvas = require('canvas');
var pluralize = require('pluralize');



module.exports = (client, reaction, user) => {
    reaction.message.guild.fetchMember(user)
        .then((addedByMember) => 
        { client.lastSeen(addedByMember, `Removing a reaction from a message in #${reaction.message.channel.name}`)
        })

    let channel_id_color = "562328013371605012"; 
    let message_id_color = client.cfg.color1;

    let channel_id_color2 = "562328013371605012"; 
    let message_id_color2 = client.cfg.color2;

    let channel_id_other = "562328013371605012"; 
    let message_id_other = client.cfg.other1;

    let channel_id = "562586739819151370"; 
    let message_id = client.cfg.ruleAccept;

    let guild = reaction.message.guild;

    const announcementEmoji = client.emojis.find(emoji => emoji.name === "Announcement_notif");

    if((reaction.emoji.id == "562330233315917843" || reaction.emoji.id == "562330227322388485" || reaction.emoji.id == "586161821338042379" || reaction.emoji.id == "586161821551951882" || reaction.emoji.id == "586161821044441088") && guild !== null && guild !== undefined) {
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
                client.handleKarmaObj(type, reaction.message.author.id, -1)
                
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
                        starboardChannel.fetchMessage(post.starboardid).then(message => {
                            message.delete(100)
                            starboardChannel.send({embed: starboardembed, files: [{attachment: canvas.toBuffer(), name: `votes${randID}.png`}]}).then(message => {
                                obj.starboardid = message.id
                                client.starboard.set(msg.id, obj)
                            });
                        })
                    } else {
                        console.log("new post")
                        starboardChannel.send({embed: starboardembed, files: [{attachment: canvas.toBuffer(), name: `votes${randID}.png`}]}).then(message => {
                            obj.starboardid = message.id
                            client.starboard.set(msg.id, obj)
                        })
                    }
                } else if(up - down < client.cfg.minStarboardScore && post.starboardid) {
                    starboardChannel.fetchMessage(post.starboardid).then(message => {
                        message.delete(200)
                        obj.starboardid = null
                        client.starboard.set(msg.id, obj)
                    })
                }
            } else {
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
                    starboardid: null,
                    upvotes: up,
                    downvotes: down,
                    plat: plat,
                    gold: gold,
                    silver: silver
                }
                client.handleKarmaObj(type, reaction.message.author.id, -1)
                client.starboard.set(msg.id, obj)
            }
        }
        
    }

    var Poll = client.polls.get(reaction.message.id)
    if(Poll) {
        reaction.message.channel.fetchMessage(reaction.message.id)
        .then(async function (message) {

            const optionsList = Poll.Options
            const emojiList = Poll.Emotes
            const ExpirationOfPoll = Poll.Expire
            const time = Poll.Duration
            const issuingUser = Poll.Author
            const question = Poll.Question
            const optionsText = Poll.OptionsText

            var reactionCountsArray = [];
            for (var i = 0; i < optionsList.length; i++) {
                reactionCountsArray[i] = message.reactions.get(emojiList[i]).count-1;
            }

            var max = -Infinity, indexMax = [];
            for(var i = 0; i < reactionCountsArray.length; ++i)
                if(reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                else if(reactionCountsArray[i] === max) indexMax.push(i);

            var leadingEmote = []

            var UpdatedText = "";
            if (reactionCountsArray[indexMax[0]] == 0) {
                UpdatedText = "Nobody has voted yet."
            } else {
                for (var i = 0; i < indexMax.length; i++) {
                    leadingEmote.push(`${emojiList[indexMax[i]]} \`${optionsList[indexMax[i]]}\``)
                }
            }
            if (leadingEmote.length == 1) UpdatedText = leadingEmote.join(", ").replace(/, ([^,]*)$/, ' and $1') + ` is currently leading!`
            else if(leadingEmote.length > 1) UpdatedText = leadingEmote.join(", ").replace(/, ([^,]*)$/, ' and $1') + ` are currently leading!`
            else UpdatedText = "Nobody has voted yet."
            
            var embed = new RichEmbed()
            .setTitle(question)
            .addField(`Options`, optionsText)
            .setAuthor("Poll issued by " + issuingUser.user.username, issuingUser.user.displayAvatarURL)
            .setColor(issuingUser.displayHexColor)
            .setFooter(`The poll has started and will last ${prettyMs(time, {compact: true, verbose: true})}`);

            embed.setTimestamp();
            embed.setDescription(`**${UpdatedText}**\n⌛ ${prettyMs(ExpirationOfPoll - Date.now(), {compact: true, verbose: true})} remaining`)
            
            message.edit("", embed);
        })
    }
    
    if(reaction.emoji.name === "🗄" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) 
    {
        guild.fetchMember(user)
            .then((member) => 
            {
                let role = (member.guild.roles.find(role => role.name === "Archivist"));
                member.removeRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
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
                member.removeRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
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
                member.removeRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
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
                member.removeRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
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
                member.removeRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
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
                member.removeRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
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
                member.removeRole(role)
                .then(() => 
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
                }
                );
            });
    }
    
}