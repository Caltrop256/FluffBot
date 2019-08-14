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
    name: 'removereminder',
    aliases: ['rr'],
    description: 'Removes a specfic reminder of a specified user',
    args: true,
    usage: '<reminderID> <@user>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
    let warnUser = client.getMemberFromArg(receivedMessage, arguments, 1)
    if(!warnUser) return receivedMessage.reply("Couldn't find specified user");
    let tbRemoveID = parseInt(arguments[0])
    if(!tbRemoveID) return receivedMessage.reply(`Please provide the ReminderID of the Reminder you want to remove.\nYou can see the ReminderID when you do \`${client.cfg.prefix}myreminders\`.`)
    if(isNaN(tbRemoveID)) return receivedMessage.reply(`Please provide the ReminderID of the Reminder you want to remove.\nYou can see the ReminderID when you do \`${client.cfg.prefix}myreminders\`.`)

    if(arguments.length > 1 && !receivedMessage.member.hasPermission("MANAGE_MESSAGES") && receivedMessage.member !== warnUser) return receivedMessage.reply("You can only delete your own Reminders.")

    connection.query(`SELECT * FROM remindme WHERE userid = '${warnUser.id}' AND ID = ${parseInt(tbRemoveID)}`, (err, rows) => {
        if(err) throw err;
        if(rows.length < 1) {
            return receivedMessage.reply(`\`${warnUser.displayName}\` does not have a \`${parseInt(tbRemoveID)}\` reminder.`)
        } else {
            rows.forEach(row => {
                connection.query(`DELETE FROM remindme WHERE ID = ${parseInt(tbRemoveID)} AND userid = ${warnUser.id};`, console.log)
                receivedMessage.reply(`Deleted a Reminder from \`${warnUser.displayName}\` with the ID of \`${parseInt(tbRemoveID)}\``)
            })
        }
    })

   }
}