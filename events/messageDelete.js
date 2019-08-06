// messageDelete
/* Emitted whenever a message is deleted.
PARAMETER      TYPE           DESCRIPTION
message        Message        The deleted message    */

const Discord = require('discord.js');
const config = require(`../commands/json/config.json`);

module.exports = async (client, message) => {
    
    const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first())
    let user = {}
      if (entry.extra.channel.id === message.channel.id
        && (entry.target.id === message.author.id)
        && (entry.createdTimestamp > (Date.now() - 5000))
        && (entry.extra.count >= 1)) {
      user = entry.executor
    } else { 
      user = message.author
    }
    const embeds = message.embeds;
    const attachments = message.attachments; 
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
    
    var footer = entry.reason ? `ID: ${message.author.id}, Reason: ${entry.reason}` : `ID: ${message.author.id}`
    var Embed = new Discord.RichEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .setTimestamp()
    .setColor(0xFC4B4B)
    .setFooter(footer)
    .setImage(eURL)
    if(user !== message.author){Embed.setDescription(`**A message sent by ${message.author} was deleted by ${user} in ${message.channel}**[Jump to Message](${message.url})\n${message.content}`)}
    else Embed.setDescription(`**${message.author} deleted their own message in ${message.channel}**[Jump to Message](${message.url})\n${message.content}`)

    const logs = client.channels.get(client.cfg.logChannel)

    logs.send({embed: Embed})
    
}