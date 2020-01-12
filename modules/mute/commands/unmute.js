'use strict';
module.exports = {
    name: 'unmute',
    aliases: ['lunmute', 'unnaenae'],
    description: 'Unmutes a selected user',
    args: true,
    usage: '<@user> <channel>',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MUTE_MEMBERS'],


    execute(client, args, message) {
        var user = client.getMember(args[0], message.guild, null);
        if (!user) return message.reply(`I couldn't find that user`)

        var channel = client.getChannel(args[1], null) || null;
        var channelId = channel ? channel.id : null

        client.unmuteUser(client, user.id, false, channelId)
            .then(() => {
                message.react("✅");
            })
            .catch(err => {
                message.reply(err);
            });
    }
};

