'use strict';

module.exports = {
    name: 'slowmode',
    aliases: ['sm', 'slow'],
    description: `Changes the rate limit per user for a specific channel`,
    args: true,
    usage: '<seconds> <#channel>',
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_CHANNELS'],

    execute(client, args, message) {
        var newRate = parseInt(args[0])
        if ((!newRate && newRate !== 0) || (Math.sign(parseInt(newRate)) < 0 && newRate !== 0) || newRate > 21600) return message.reply(`The Slowmode rate must be an integer number between 0 and 21600`)
        var channel = client.getChannel(args[1], message.channel)
        if (!channel) return message.reply('Couldn\'t find that channel')
        var oldRate = channel.rateLimitPerUser

        channel.setRateLimitPerUser(newRate, `Command by ${message.author.tag}`)

        var rateLimitUpdateEmbed = client.scripts.getEmbed()
            .setAuthor(`Slowmode changed in #${channel.name}`, message.author.avatarURL)
            .setDescription(`\`${oldRate}s\` => \`${newRate}s\``)
            .setColor(0x76C7F2)
            .setTimestamp()

        message.channel.send({ embed: rateLimitUpdateEmbed })
    }
};