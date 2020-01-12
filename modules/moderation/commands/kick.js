'use strict';

module.exports = {
    name: 'kick',
    aliases: ['yeet'],
    description: 'Kicks a selected user from the Guild',
    args: true,
    usage: '<@user> <reason>',
    rateLimit: {
        usages: 5,
        duration: 60,
        maxUsers: 3
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'KICK_MEMBERS'],


    execute(client, args, message) {
        var kickUser = client.getMember(args[0], message.guild, null);
        if (!kickUser) return message.reply("Couldn't find specified user");

        let reason = args.join(" ").slice(args[0].length);
        if (!reason) reason = `No reason provided`

        const logs = client.channels.get(client.constants.modLogs);

        var embed = client.scripts.getEmbed()
            .setAuthor(kickUser.tag, kickUser.displayAvatarURL)
            .setDescription(`**${kickUser.toString()} has been kicked by ${message.member.toString()}**\n\nReason: ${reason}`)
            .setTimestamp()
            .setColor(client.constants.redder.hex)
            .setFooter(`ID: ${kickUser.id}`);

        logs.send({ embed });

        var DmEmbed = client.scripts.getEmbed()
            .setAuthor(`You've been kicked`, client.user.displayAvatarURL)
            .setDescription(`You've been kicked from ${message.guild.name} by ${message.member.toString()}`)
            .setColor(client.constants.redder.hex)
            .setTimestamp();

        kickUser.send({ embed: DmEmbed }).then(() => {
            kickUser.kick({ reason })
        });
    }
};
