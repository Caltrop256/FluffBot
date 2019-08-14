const Discord = require('discord.js');
const config = require(`./json/config.json`);
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
    name: 'remindme',
    aliases: ['remind', 'reminder', 'setreminder'],
    description: 'Sets a reminder for a certain period of time',
    args: true,
    usage: '<time> <reminder>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {

        let params = receivedMessage.content.split(" ").slice(1);
        let time = parseInt(ms(params[0]))
        if(!time) return receivedMessage.reply("No time arguments received.")
        if(time > 473354280000 || time < 60000 * 5 || isNaN(time)) return receivedMessage.reply("Reminders must be set less than 15 years and more than 5 minutes in the Future.")
        var reminder = arguments.join(" ").slice(arguments[0].length)
        if(!reminder) reminder = "No reason."
        if(reminder.length > 512 || reminder.length < 2) return receivedMessage.reply("Reminders must be between 2 and 512 characters in length.")


        connection.query(`SELECT * FROM remindme WHERE userid = '${receivedMessage.author.id}'`, (err, rows) => {
            if(err) throw err;
            let sql;
            if(rows.length <= 10) {
                sql = `INSERT INTO remindme (channelid, userid, reminder, expiry, start, ID) VALUES ('${receivedMessage.channel.id}', '${receivedMessage.author.id}', ?, ${Date.now() + time}, ${Date.now()}, ${Math.floor(Math.random() * 10000)});`
                connection.query(sql, [reminder], console.log)

                var ReminderEmbed = new Discord.RichEmbed()
                .setAuthor(`Reminder set!`, receivedMessage.author.displayAvatarURL, receivedMessage.author.displayAvatarURL)
                .setColor(0x4AD931)
                .setTimestamp()
                .setDescription(`I will remind you in \`${prettyMs(time, {verbose: true, compact: true})}\` of the following.`)
                .addField(`Reminder`, reminder)

                receivedMessage.channel.send({embed: ReminderEmbed})
            } else {
                return receivedMessage.reply(`You may not have more than 10 active reminders at once.`)
            }
        })
    }
}