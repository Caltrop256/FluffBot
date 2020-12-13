'use strict';

module.exports = {
    name: 'ban',
    aliases: ['>:('],
    description: 'Bans a selected user from the Guild',
    args: true,
    usage: '<@user> <reason>',
    rateLimit: {
        usages: 3,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'BAN_MEMBERS'],


    execute(client, args, message)
    {
        var banUser = client.getMember(args[0], message.guild, null);
        if (!banUser) return message.reply("Couldn't find specified user");

        let reason = args.join(" ").slice(args[0].length);
        if (!reason) reason = `No reason provided`
        client.createConfirmation(message, {
            title: 'Are you sure?',
            description: `You are about to permanently remove ${banUser} from this Guild, are you sure this is correct?`,
            timeout: client.time(60000),
            color: client.constants.redder,
        }).then((hasConfirmed) =>
        {
            if (hasConfirmed)
            {
                const logs = client.channels.get(client.constants.modLogs);

                var embed = client.scripts.getEmbed()
                    .setAuthor(banUser.tag, banUser.displayAvatarURL)
                    .setDescription(`**${banUser.toString()} has been banned by ${message.member.toString()}**\n\nReason: ${reason}`)
                    .setTimestamp()
                    .setColor(client.constants.redder.hex)
                    .setFooter(`ID: ${banUser.id}`);

                logs.send({ embed });

                var DmEmbed = client.scripts.getEmbed()
                    .setAuthor(`You've been banned`, client.user.displayAvatarURL)
                    .setDescription(`You've been banned from ${message.guild.name} by ${message.member.toString()}`)
                    .setColor(client.constants.redder.hex)
                    .setTimestamp();
                banUser.send({ embed: DmEmbed }).finally(() =>
                {
                    banUser.ban({ reason }).then(() =>
                    {
                        message.guild.fetchInvites().then(invites =>
                        {
                            for (var [code, invite] of invites)
                                if (invite.inviter.id == banUser.user.id)
                                    invite.delete('Banned User');
                        });
                    })
                });
            }
        }).catch((err) =>
        {
            if (err)
            {
                message.channel.send("An Error Has Occured. Please DM a developer to look into this");
                client.lastErr.push(err);
                console.log(err);
            }
            else
                message.channel.send("Timed Out").then(tMsg => setTimeout(() => tMsg.delete(), 5000));
        });
    }
};
