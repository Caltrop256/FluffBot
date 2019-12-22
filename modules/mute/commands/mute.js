'use strict';


module.exports = {
    name: 'mute',
    aliases: ['lmute', 'longmute', 'naenae'],
    description: 'Mutes a selected user for a specific amount of time',
    args: true,
    usage: '<@user> <time> <#channel>',
    guildOnly: true,
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MUTE_MEMBERS'],


    execute(client, args, message) {

        var user = client.getMember(args[0], message.guild, null);
        if (!user) return message.reply(`I couldn't find that user`)

        let time = Math.abs(client.time.fromString(args[1]).ms);
        if (!time) return message.reply("No time args received.")

        var channel = client.getChannel(args[2], null) || null;
        var channelId = channel ? channel.id : null

        client.muteUser(client, user.id, message.author.id, Date.now() + time, Date.now(), message.guild, false, channelId)
            .then(() => {
                message.react("✅");
            })
            .catch(err => {
                message.reply(err);
            });
    }
};