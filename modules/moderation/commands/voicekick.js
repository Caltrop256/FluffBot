'use strict';

module.exports = {
    name: 'voicekick',
    aliases: ['vckick', 'vkick'],
    description: 'Kicks a selected user from the voice channel',
    args: true,
    usage: '<@user>',
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MOVE_MEMBERS'],


    execute(client, args, message)
    {
        let kickUser = client.getMember(args.join(" "), message.guild, null);
        if (!kickUser) return message.reply("Couldn't find specified user");
        kickUser.setVoiceChannel(null)
            .then(() => message.react("✅"))
            .catch(() => message.react("❌"));
    }
};
