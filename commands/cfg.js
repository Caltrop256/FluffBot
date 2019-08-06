const Discord = require('discord.js');
const config = require("./json/config.json");
const fs = require('fs');
const ms = require('ms');
var mysql = require('mysql');
if(config.maintenance == false) {
    var connection = mysql.createConnection({
        host     : `localhost`,
        port     : `3306`,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}else {
    var connection = mysql.createConnection({
        host     : config.mySQLHost,
        port     : config.mySQLPort,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}


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
        maxUsers: 1
    },
    permLevel: 3, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        if(arguments.length) {
            var raw = arguments.join(" ")
            var strings = raw.split("|")
            var key = strings[0]
            var value = strings[1]

            connection.query(`SELECT * FROM config WHERE config = '${key}'`, (err, rows) => {
                if(err) throw err;
                if(rows.length < 1) {
                    return receivedMessage.channel.send(`\`${key}\`, no such key.`)
                } else {
                    var ogKey = rows[0].config
                    var ogValue = rows[0].value
                    connection.query(`UPDATE config SET value = '${value}' WHERE config = '${key}'`)
                    client.cfg[key] = value
                    var cfgUpdateEmbed = new Discord.RichEmbed()
                    .setAuthor(`Updated Config`)
                    .setTitle(key)
                    .setDescription(`✅\`${ogValue}\` => \`${value}\``)
                    .setColor(0x74B979)
                    receivedMessage.channel.send({embed: cfgUpdateEmbed})
                    console.log(client.cfg)
                }
            })
        } else {
            connection.query(`SELECT * FROM config`, (err, rows) => {
                if(err) throw err;
                var cfgs = ''
                rows.forEach(row => {
                    cfgs = cfgs + `\`${row.config}\` | \`${row.value}\`\n`
                })
                receivedMessage.channel.send("**Key** | **Value**\n" + cfgs)
            })
        }
    }
}