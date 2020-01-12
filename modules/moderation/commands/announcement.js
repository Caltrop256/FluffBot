'use strict';

module.exports = {
    name: 'announcement',
    aliases: ['announce'],
    description: 'Enables the pinging of @announcements for 5 seconds.',
    args: false,
    usage: 'time',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 1
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_CHANNELS'],

    execute(client, args, message) {
        let announcementsRole = message.guild.roles.get("562923651679125504");
        announcementsRole.edit({ mentionable: true }, ["Announcements activated"]);
        message.react(":ralPing:562330233714507776");

        var time = parseInt(args[0] * 1000) || 5000

        setTimeout(() => {
            announcementsRole.edit({ mentionable: false }, ["Announcements deactivated"]);
            message.react("👌");
        }, time);
    }
}