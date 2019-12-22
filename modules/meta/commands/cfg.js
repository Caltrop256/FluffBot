'use strict';

module.exports = {
    name: 'cfg',
    aliases: ['config'],
    description: 'Edits the config files',
    args: false,
    usage: '<key>|<value>',
    guildOnly: false,
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 2
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'ADMINISTRATOR'],

    execute(client, args, message) {
        var connection = client.scripts.getSQL(false)
        if(args.length) {
            var raw = args.join(" ")
            var strings = raw.split("|")
            var key = strings[0]
            var value = strings[1]

            connection.query(`SELECT * FROM config WHERE \`key\` = '${key}'`, (err, rows) => {
                if(err) throw err;
                if(rows.length < 1) {
                    return message.channel.send(`\`${key}\`, no such key.`)
                } else {
                    var ogKey = rows[0].key
                    var ogValue = rows[0].value
                    connection.query(`UPDATE config SET \`value\` = '${value}' WHERE \`key\` = '${key}'`)
                    client.cfg[key] = value
                    var cfgUpdateEmbed = client.scripts.getEmbed()
                    .setAuthor(`Updated Config`)
                    .setTitle(key)
                    .setDescription(`✅\`${ogValue}\` => \`${value}\``)
                    .setColor(0x74B979)
                    message.channel.send({embed: cfgUpdateEmbed})
                    console.log(client.cfg)
                }
            })
        } else {
            connection.query(`SELECT * FROM config`, (err, rows) => {
                if(err) throw err;
                var cfgs = ''
                rows.forEach(row => {
                    cfgs = cfgs + `\`${row.key}\` | \`${row.value}\`\n`
                })
                message.channel.send("**Key** | **Value**\n" + cfgs)
            })
        }
    }
}