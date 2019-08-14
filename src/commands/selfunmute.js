const Discord = require('discord.js');
const config = require("./json/config.json");
const fs = require('fs');
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
    name: 'selfunmute',
    aliases: ['demutify', 'unh', 'unmutify'],
    description: 'Removed a selected User from their selfmute',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {

        var unmutemember = receivedMessage.author
        var mainGuild = client.guilds.get("562324876330008576")
        let muteRole = mainGuild.roles.get("562364319761956875")
        if(!muteRole) return receivedMessage.reply("Mute Role not found.")

        connection.query(`SELECT * FROM mute WHERE id = '${unmutemember.id}' AND selfmute = 1`, (err, rows) => {
            if(err) throw err;
            let sql;
            if(rows.length < 1) {
                return receivedMessage.reply(`You either aren't muted or your mute was issued by a moderator.`)
            } else {
                var mute = rows[0]
                var MinimumDuration = (mute.expiry - mute.start) / 10
                if(MinimumDuration < 1800000) MinimumDuration = 1800000
                var completedDuration = (Date.now() - mute.start)
                
                if(completedDuration < MinimumDuration) {
                    var UnmuteRequestReject = new Discord.RichEmbed()
                    .setAuthor(`Unmute Request`, receivedMessage.author.avatarURL)
                    .setColor(embedRed)
                    .setTimestamp()
                    .setDescription(`You are not eligible for an unmute yet, please wait another \`${prettyMs(MinimumDuration - completedDuration, {verbose: true, compact: true})}\`!`)

                    return receivedMessage.channel.send({embed: UnmuteRequestReject})
                } else {

                }
            }
        })
      
    }

};

