'use strict';

module.exports = {
    name: 'warncount',
    aliases: ['warns', 'mywarns'],
    description: 'Displays the warns of a specified user',
    args: false,
    usage: '<@user>',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


    execute(client, args, message)
    {

        if (args.length && !client.scripts.getPerms(client, message.member).includes('VIEW_AUDIT_LOG'))
            return message.reply('You need the `View Audit Logs` permission to be able to view other User\'s warns.');

        var warnUser = args.length ?
            client.getMember(args.join(" "), message.guild, message.member) :
            message.member;

        if (!warnUser) return message.reply("Couldn't find specified user");

        client.getWarnEntries(warnUser.id, false).then((w) =>
        {

            var active = client.scripts.getEmbed()
                .setAuthor(`${warnUser.user.tag}'s active Warns`)
                .setDescription(`Warnlevel: **${w.warnLevel}**`)
                .setColor(client.constants.redder.hex)
                .setTimestamp();

            var expired = client.scripts.getEmbed()
                .setAuthor(`${warnUser.user.tag}'s expired Warns`)
                .setDescription(`**${w.warns.length} total warns** (${w.warnLevel} active)`)
                .setColor(client.constants.red.hex)
                .setTimestamp();

            w.warns.forEach((warn) =>
            {
                if (warn.active)
                {
                    active.addField(warn.id, `**Applied by** ${message.guild.members.get(warn.modId).toString()}\n**Level**: \`${warn.level}\`\n**Applied**: \`${client.time(Date.now() - warn.start)} ago\`\**nExpires in** \`${client.time(warn.expiry - Date.now())}\`\n**Reason:** ${warn.reason}`, true)
                } else
                {
                    expired.addField(warn.id, `**Applied by** ${message.guild.members.get(warn.modId)}\n**Level**: \`${warn.level}\`\n**Applied**: \`${client.time(Date.now() - warn.start)} ago\`\n**Expired** \`${client.time(Date.now() - warn.expiry)} ago\`\n**Reason:** ${warn.reason}`, true)
                }
            })
            message.author.send({ embed: active });
            message.author.send({ embed: expired });
        })
    }
}