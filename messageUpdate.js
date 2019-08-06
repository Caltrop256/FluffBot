// messageUpdate
/* Emitted whenever a message is updated - e.g. embed or content change.
PARAMETER     TYPE           DESCRIPTION
oldMessage    Message        The message before the update
newMessage    Message        The message after the update    */

const Discord = require('discord.js');
const config = require("../commands/json/config.json");
const leven = require('leven');
var ordinal = require('ordinal-number-suffix')
const smartTruncate = require('smart-truncate');
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


module.exports = (client, oldMessage, newMessage) => {
    if (newMessage.channel.type == 'text' && newMessage.cleanContent != oldMessage.cleanContent) {
        client.lastSeen(newMessage.member, `Edited their message in #${newMessage.channel.name}`)
        const embeds = newMessage.embeds;
        const attachments = newMessage.attachments; 
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
        var Embed = new Discord.RichEmbed()
        .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL)
        .setTimestamp()
        .setColor(0xFC4B4B)
        .setImage(eURL)
        .setDescription(`**${newMessage.author} edited their message for the ${ordinal(newMessage.edits.length-1)} time**[Jump to Message](${newMessage.url})`)
        .setFooter(`ID: ${newMessage.author.id}`)
        var edits = newMessage.edits.reverse()
        edits.forEach((e, index) => {
            if(index == 0) {Embed.addField(`Original Message`, smartTruncate(e.content, 512)||`\`File only\``)}
            else Embed.addField(`${ordinal(index)} Edit [${leven(Embed.fields[index-1].value, e.content)}]`, smartTruncate(e.content, 512)||`\`File only\``)
        })
        const logs = client.channels.get(client.cfg.logChannel)
        logs.send({embed: Embed})
    }
    var fetchedMessage = newMessage

    var noMarkDown = newMessage.content.toLowerCase().replace(/(?![a-zA-Z])./gi, "")
    if(noMarkDown == "k") return newMessage.delete(1);

    if(fetchedMessage.guild !== null && fetchedMessage.guild !== undefined) {
        if (fetchedMessage.author.bot) return;
        if (fetchedMessage.content.startsWith(client.cfg.prefix)) return;

        var forbiddenChannels = ['562328246683697154', '562328446445944872', '575985149368467466', '562338340918001684', '562328726738567168', '562338454395027469', '571770555343175719']

        curChannel = fetchedMessage.channel.id

        for (var i = 0; i < forbiddenChannels.length; i++) {
            if(curChannel.includes(forbiddenChannels[i])) {
                return
            }
        }
        
        var editedString = client.swearDetect(fetchedMessage.content)
        if(editedString.replaced) {
            console.log(console.color.yellow(`[Swear Filter] [Edited Textmessage]`),`Replaced: ${editedString.replaced}, "${editedString.string}" | ${editedString.bitmap}`)

            if(fetchedMessage.member.displayName.toString().length < 3) {var name = fetchedMessage.author.username}
            else {var name = fetchedMessage.member.displayName}
            const embeds = fetchedMessage.embeds;
            const attachments = fetchedMessage.attachments; 

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
                    
            fetchedMessage.delete(200)
            someoneWebhook(fetchedMessage)

            async function someoneWebhook(fetchedMessage) {
            await fetchedMessage.channel.createWebhook(name, fetchedMessage.member.user.avatarURL)
            .then(webhook => webhook.edit(name, fetchedMessage.member.user.avatarURL))

                await fetchedMessage.channel.fetchWebhooks().then((webhooks) => { 
                    if (webhooks.filter(w => w.owner == client.user).array().length > 0){  

                        var someoneHook = webhooks.filter(w => w.owner == client.user).first();

                        webhookSend(someoneHook)

                        async function webhookSend(someoneHook) {
                        var someoneHook = webhooks.filter(w => w.owner == client.user).first();
                            await someoneHook.send(editedString.string, {file: eURL, split: true});
                            someoneHook.delete(100)
                    }}
                })
                
            }
        }
    }
        
}