'use strict';

module.exports = {
    name: 'topic',
    aliases: ['ct', 'channeltopic'],
    description: 'Displays the channel topic',
    args: false,
    usage: '<#channel>',
    rateLimit: {
        usages: 3,
        duration: 20,
        maxUsers: 3
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {
        var channel = client.getChannel(args[0], message.channel)
        if(!channel) channel = message.channel

        var topicEmbed = client.scripts.getEmbed()
        .setAuthor(`Topic of #${channel.name}`)
        .setDescription(`${channel.topic}`)
        .setColor(0x76FF7B)

        message.channel.send({embed: topicEmbed})
    }
}