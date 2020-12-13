'use strict';


module.exports = {
    name: 'selfmute',
    aliases: ['h'],
    description: 'Mutes the User for a selected amount of time',
    args: true,
    usage: '<time>, <channel>',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


    execute(client, args, message)
    {

        let time = client.time.fromString(args[0]).ms;
        if (!time) return message.reply("No time args received.")
        if (time < 600000 * 3) return message.reply("Selfmutes must at least be 30 minutes long.")
        if (time > 2628028800) return message.reply("Selfmutes must not be longer than 1 month.")
        var channel = client.getChannel(args[1], null) || null;
        var channelId = channel ? channel.id : null

        client.muteUser(client, message.author.id, message.author.id, Date.now() + time, Date.now(), message.guild, true, channelId)
            .then(() =>
            {
                message.react("✅");
                message.channel.send(`You have been muted for ${client.time(time, true)}\nSee you soon <:neon_pink_heart:608779835090927661>`)
            })
            .catch(err =>
            {
                message.reply(err);
            });
    }
};