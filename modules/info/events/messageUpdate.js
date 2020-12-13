// messageUpdate
/* Emitted whenever a message is updated - e.g. embed or content change.
PARAMETER     TYPE           DESCRIPTION
oldMessage    Message        The message before the update
newMessage    Message        The message after the update    */

const smartTruncate = require('smart-truncate')
var distance = require("leven");

module.exports = {
    async execute(client, oldMessage, newMessage)
    {
        if (newMessage.channel.type == 'text' && newMessage.cleanContent != oldMessage.cleanContent)
        {
            client.lastSeen(newMessage.member, `Edited their message in #${newMessage.channel.name}`)
            const embeds = newMessage.embeds;
            const attachments = newMessage.attachments;
            let eURL = ''
            if (embeds.length > 0)
            {
                if (embeds[0].thumbnail && embeds[0].thumbnail.url)
                    eURL = embeds[0].thumbnail.url;
                else if (embeds[0].image && embeds[0].image.url)
                    eURL = embeds[0].image.url;
                else
                    eURL = embeds[0].url;
            } else if (attachments.array().length > 0)
            {
                const attARR = attachments.array();
                eURL = attARR[0].url;
            }
            var Embed = client.scripts.getEmbed()
                .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL)
                .setTimestamp()
                .setColor(0xFC4B4B)
                .setImage(eURL)
                .setDescription(`**${newMessage.author} edited their message for the ${client.scripts.ordinalSuffix(newMessage.edits.length - 1)} time**[Jump to Message](${newMessage.url})`)
                .setFooter(`ID: ${newMessage.author.id}`)
            var edits = newMessage.edits.reverse()
            edits.forEach((e, index) =>
            {
                if (index == 0) { Embed.addField(`Original Message`, smartTruncate(e.content, 512) || `\`File only\``) }
                else Embed.addField(`${client.scripts.ordinalSuffix(index)} Edit [${distance(Embed.fields[index - 1].value, e.content)}]`, smartTruncate(e.content, 512) || `\`File only\``)
            })
            const logs = client.channels.get(client.cfg.logChannel)
            logs.send({ embed: Embed })
        }
    }
};