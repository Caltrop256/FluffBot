'use strict';
module.exports = {
    name: 'usertag',
    aliases: ['utag'],
    description: 'Shows specified user\'s tag',
    args: true,
    usage: '<user>',
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message)
    {
        var user = client.getMember(args.join(" "), message.guild, null)
        if (!user) return message.reply("Couldn't find User.")
        message.channel.send(user.user.tag);

    }
}