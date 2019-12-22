'use strict';
module.exports = {
    name: 'dm',
    aliases: ['directmessage'],
    description: 'Sends a message to a member',
    args: true,
    usage: '<user> <message>',
    guildOnly: true,
    rateLimit: {
        usages: Infinity,
        duration: 1,
        maxUsers: 10
    },
    perms: ['MANAGE_MESSAGES'],
    enabled: true,

    execute(client, args, message) {
        var member = client.getMember(args[0], message.guild, null);
        if (!member) return message.member.send('Couldn\'t find that Member!');
        var content = args.join(" ").substring(args[0].length);
        member.send(content, { file: client.scripts.getImage(message), split: true });
    }
};