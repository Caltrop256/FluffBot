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
    name: 'removewarn',
    aliases: ['rw'],
    description: 'Removes a specfic warn of a specified user',
    args: true,
    usage: '<@user> <warnID>',
    guildOnly: true,
    rateLimit: {
        usages: 5,
        duration: 10,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
    let warnUser = client.getMemberFromArg(receivedMessage, arguments)
    if(!warnUser) return receivedMessage.reply("Couldn't find specified user");
    let tbRemoveID = arguments.join(" ").slice(client.cfg.prefix.length + arguments[0].length);

    connection.query(`SELECT * FROM warn WHERE userid = '${warnUser.id}' AND randid = ${parseInt(tbRemoveID)}`, (err, rows) => {
        if(err) throw err;
        if(rows.length < 1) {
            return receivedMessage.reply(`${warnUser} does not have a \`${parseInt(tbRemoveID)}\` warn.`)
        } else {
            rows.forEach(row => {
                connection.query(`DELETE FROM warn WHERE randid = ${parseInt(tbRemoveID)} AND userid = ${warnUser.id};`, console.log)
            })
        }
    })

   }
}