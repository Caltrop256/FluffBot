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
    name: 'myreminders',
    aliases: ['myremind'],
    description: 'Displays the reminders of the User executing the command',
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

    connection.query(`SELECT * FROM remindme WHERE userid = '${warnUser.id}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        var warnCountEmbed = new Discord.RichEmbed()
        .setAuthor(`${warnUser.displayName}'s Reminds`, warnUser.user.avatarURL, warnUser.user.avatarURL)
        .setDescription(`**Below you will find a list of ${warnUser.displayName}'s ${rows.length} active reminders**`)
        .setColor(0x74B979)

        if(rows.length > 0) {
            rows.forEach(row => {
                var invokingMember = receivedMessage.guild.members.get(row.invokinguser)
                warnCountEmbed.addField(`ID: ${row.ID}`, `\nExpires in: \`${prettyMs(row.expiry - Date.now(), {verbose: true, compact: true})}\`\nApplied \`${prettyMs( Date.now() - row.start, {verbose: true, compact: true})} ago\`\nReminder: \`${row.reminder}\``, true)

                });
                receivedMessage.reply(`I have sent you a list of your reminders.`)
                receivedMessage.author.send({embed: warnCountEmbed})
                .catch(error => {
                    console.error(`Could not send help DM to a user.\n`, error);
                    receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
            })
        } else {
            receivedMessage.reply("You don't have any active reminders set right now.")
        }
      

        })
   }
}