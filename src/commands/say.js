const Discord = require('discord.js');

module.exports = {
    name: 'say',
    aliases: ['say'],
    description: 'Echoes the input',
    args: true,
    usage: '<message>',
    guildOnly: false,
    rateLimit: {
        usages: Infinity,
        duration: 1,
        maxUsers: 10
    },
    permLevel: 1, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {
        const embeds = receivedMessage.embeds;
        const attachments = receivedMessage.attachments; 

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

        receivedMessage.delete(100);
        receivedMessage.channel.send(receivedMessage.content.slice(client.cfg.prefix.length + 4, receivedMessage.content.length), {file: eURL, split: true})
    }
}