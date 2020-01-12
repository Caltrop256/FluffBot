'use strict';

module.exports = {
    name: 'warn',
    aliases: ['w'],
    description: 'Warns a selected user',
    args: true,
    usage: '<@user> <reason>',
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_GUILD'],


    execute(client, args, message) {
        var member = client.getMember(args[0], message.guild, null);
        if (!member) return message.reply(`Couldn't locate that member!`);

        var reason = args.join(" ").slice(args[0].length);
        if (!reason) reason = 'no reason provided';

        client.warnUser(member.id, message.member.id, message.guild.id, reason);
    }
};
