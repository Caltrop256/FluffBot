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
    name: 'lastseen',
    aliases: ['whereis', 'heck'],
    description: 'Displays the last known sighting and activity of a given member',
    args: true,
    usage: '<@user>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
       var member = client.getMemberFromArg(receivedMessage, arguments, null, true)
       if(!member) return receivedMessage.reply(`Couldn't locate that user.`)

       var user = member.user

       if(user.id == receivedMessage.author.id) return receivedMessage.reply(`That's you...`)

       var collectionOBJ = client.lastSeenCollec.get(user.id)
       if(collectionOBJ) {
            var lastseenembed = new Discord.RichEmbed()
            .setAuthor(user.tag, user.avatarURL)
            .setThumbnail(user.avatarURL)
            .setDescription(`Last seen \`${prettyMs(Date.now() - collectionOBJ.date, {verbose: true})}\` ago\nActivity: \`${collectionOBJ.activity}\``)
            .setFooter(collectionOBJ.id)
            .setColor(receivedMessage.member.displayHexColor)
            .setTimestamp();

            receivedMessage.channel.send({embed: lastseenembed})
       } else {
            connection.query(`SELECT * FROM lastseen WHERE id = '${user.id}'`, (err, rows) => {
                if(err) throw err
                if(rows.length > 0) {
                    var collectionOBJ = rows[0]
                    var lastseenembed = new Discord.RichEmbed()
                    .setAuthor(user.tag)
                    .setDescription(`Last seen \`${prettyMs(Date.now() - collectionOBJ.date, {verbose: true})}\` ago\nActivity: \`${collectionOBJ.activity}\``)
                    .setFooter(collectionOBJ.id)
                    .setThumbnail(user.avatarURL)
                    .setColor(receivedMessage.member.displayHexColor)
                    .setTimestamp();

                    receivedMessage.channel.send({embed: lastseenembed})
                } else return receivedMessage.reply(`I could not locate any activity for that user.`)
            })
       }

   }
}