const Discord = require('discord.js');
const config = require("./json/config.json");
const ms = require('ms');
const prettyMs = require('pretty-ms');
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

const embedGreen = 0x74B979
const embedRed = 0xFC4B4B


module.exports = {
    name: 'mywarns',
    aliases: ['mywarn'],
    description: 'Displays the warns of the User executing the command',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
        usages: 1,
        duration: 10,
        maxUsers: 5
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
    let warnUser = receivedMessage.member

    connection.query(`SELECT * FROM warn WHERE userid = '${warnUser.id}' AND active = 1`, (err, rows) => {
        if(err) throw err;
        let sql;
        var warnCountEmbed = new Discord.RichEmbed()
        .setAuthor(`${warnUser.displayName}'s Warns`, warnUser.user.avatarURL, warnUser.user.avatarURL)
        .setDescription(`**Below you will find a list of ${warnUser.displayName}'s ${rows.length} active warns**`)
        .setColor(0x74B979)

        if(rows.length > 0) {
            rows.forEach(row => {
                var invokingMember = receivedMessage.guild.members.get(row.invokinguser)
                warnCountEmbed.addField(`Warn ${row.warnid}`, `WarnID: \`${row.randid}\`\nModerator: ${invokingMember}\nExpires in: \`${prettyMs(row.expiry - Date.now(), {verbose: true, compact: true})}\`\nApplied \`${prettyMs( Date.now() - row.applied, {verbose: true, compact: true})} ago\`\nReason: \`${row.reason}\``, true)
            })
        }
        connection.query(`SELECT * FROM warn WHERE userid = '${warnUser.id}' AND active = 0`, (err, rows) => {
            if(err) throw err;
            let sql;
            warnCountEmbed.addField(`Below you will find a list of ${warnUser.displayName}'s ${rows.length} inactive warns`, "󠀡")
            if(rows.length > 0) {
                rows.forEach(row => {
                    var invokingMember = receivedMessage.guild.members.get(row.invokinguser)
                    warnCountEmbed.addField(`Warn ${row.warnid}`, `WarnID: \`${row.randid}\`\nModerator: ${invokingMember}\nApplied \`${prettyMs( Date.now() - row.applied, {verbose: true, compact: true})} ago\`\nReason: \`${row.reason}\``, true)
                })
            }
                receivedMessage.reply(`I have sent you a list of your warns.`)
                receivedMessage.author.send({embed: warnCountEmbed})
                .catch(error => {
                    console.error(`Could not send help DM to a user.\n`, error);
                    receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                });
            })
        })
   }
}