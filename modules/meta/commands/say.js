const Discord = require('discord.js');

module.exports = {
    name: 'say',
    aliases: ['veryspecificalias'],
    description: 'Echoes the input',
    args: true,
    usage: '<message>',
    rateLimit: {
        usages: Infinity,
        duration: 1,
        maxUsers: 10
    },
    perms: ['MANAGE_MESSAGES'],

    execute(client, args, message)
    {
        const embeds = message.embeds;
        const attachments = message.attachments;

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
        try
        {
            message.delete(100);
        }
        catch
        {
            console.log('unable to delete message');
        }
        message.channel.send(args.join(" "), { file: eURL, split: true })
    }
};