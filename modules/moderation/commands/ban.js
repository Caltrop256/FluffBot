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


   execute(client, args, message) { 
        var banUser = client.getMember(args[0], message.guild, null);
        if(!banUser) return message.reply("Couldn't find specified user");

        let reason = args.join(" ").slice(args[0].length);
        if(!reason) reason = `No reason provided`

        message.channel.send(client.scripts.getEmbed().setAuthor('Are you sure?', message.author.displayAvatarURL).setDescription(`You are about to permanently remove ${banUser} from this Guild, are you sure this is correct?`).setColor(client.constants.redder.hex).setTimestamp())
        .then(async msg => {
            var emojis = ['✅','❎']
            await msg.react(emojis[0]);
            await msg.react(emojis[1]);
            const filter = (reaction, user) => {
                return user.id != msg.author.id;
            };
            var collector = msg.createReactionCollector(filter, {time:60000});
            collector.on('collect',reaction => {
                if(!emojis.includes(reaction.emoji.name)) return msg.reactions.last().remove(reaction.users.first().id);
                for(var u of reaction.users) 
                {
                    if((u[0] != message.author.id) && (u[0] != msg.author.id)) {
                        return reaction.remove(u[0]);
                    };
                };
                collector.stop(); 
                if(reaction.emoji.name == emojis[0]) {

                    const logs = client.channels.get(client.constants.modLogs);

                    var embed = client.scripts.getEmbed()
                    .setAuthor(banUser.tag, banUser.displayAvatarURL)
                    .setDescription(`**${banUser.toString()} has been banned by ${message.member.toString()}**\n\nReason: ${reason}`)
                    .setTimestamp()
                    .setColor(client.constants.redder.hex)
                    .setFooter(`ID: ${banUser.id}`);

                    logs.send({embed});

                    var DmEmbed = client.scripts.getEmbed()
                    .setAuthor(`You've been banned`, client.user.displayAvatarURL)
                    .setDescription(`You've been banned from ${message.guild.name} by ${message.member.toString()}`)
                    .setColor(client.constants.redder.hex)
                    .setTimestamp();
                    message.guild.fetchInvites().then(invites => {
                        for(var [code,invite] of invites)
                            if(invite.inviter.id == banUser.user.id)
                                invite.delete('Banned User');
                    });
                    banUser.send({embed: DmEmbed}).then(() => {
                        banUser.ban({reason})
                    });
                } else {
                    return
                };
            });
            collector.on('end', () => {
                msg.delete(); 
            });
        })
    }
};
