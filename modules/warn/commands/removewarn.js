'use strict';

module.exports = {
    name: 'removewarn',
    aliases: ['remw'],
    description: 'removes a user\'s warn',
    args: true,
    usage: '<@user> <warnID>',
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_GUILD'],


    execute(client, args, message) {
        var connection = client.scripts.getSQL();
        if (args.length < 2) return message.reply('Please supply a Member and an ID')
        var member = client.getMember(args[0], message.guild, null);
        if (!member) return message.reply('Couldn\'t find that Member!');
        var id = Math.abs(parseInt(args[1]));

        connection.query(`select * from warn where warnid = ${id} AND userid = '${member.id}'`, (err, rows) => {
            if (err) return console.error(err);
            if (!rows.length) return message.reply('Couldn\'t find a warn entry with the id of ' + id + '!');
            var row = rows[0];
            connection.query(`UPDATE warn SET warnid = ${-Math.abs(row.warnid)}, active = ${0} WHERE warnid = ${row.warnid} AND userid = '${row.userid}'`, (err) => {
                if (err) return console.error(err);
                message.channel.send("Successfully removed a warn")
            });
        })
    }
};