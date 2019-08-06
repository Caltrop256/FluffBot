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
    name: 'unmute',
    aliases: ['lunmute', 'unnaenae'],
    description: 'Unmutes a selected user',
    args: true,
    usage: '<@user>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {

        let unmutemember = client.getMemberFromArg(receivedMessage, arguments)
        if(!unmutemember) return receivedMessage.reply("You haven't specified a User.")
        let muteRole = receivedMessage.guild.roles.get("562364319761956875")
        if(!muteRole) return receivedMessage.reply("Mute Role not found.")

        connection.query(`SELECT * FROM mute WHERE id = '${unmutemember.id}'`, (err, rows) => {
            if(err) throw err;
            let sql;
            if(rows.length < 1) {
                return receivedMessage.reply(`No entry of ${unmutemember.displayName} found in the mute database`)
            } else {
                sql = `DELETE FROM mute WHERE id = '${unmutemember.id}';`
                let muteExpiredChannel = client.channels.get("562338340918001684");

                var forcemuteExpiredEmbed = new Discord.RichEmbed()
                .setColor(embedGreen)
                .setAuthor("Event: #" )
                .setTitle("User unmute")
                .addField("Guild", receivedMessage.guild, false)
                .addField("User", unmutemember, false)
                .addField("User unmuted by", "Moderator " + receivedMessage.author, false)
                .addField("Original Duration", ms(rows[0].expiry - rows[0].start), false)
                .addField("Applied on", new Date(rows[0].start), false)
                .setTimestamp()

                muteExpiredChannel.send({embed: forcemuteExpiredEmbed})

                var DMforcemuteExpiredEmbed = new Discord.RichEmbed()
                .setColor(embedGreen)
                .setAuthor("You have been unmuted by a moderator")
                .addField("Guild", receivedMessage.guild, false)
                .addField("User (you)", unmutemember, false)
                .addField("User unmuted by", "Moderator " + receivedMessage.author, false)
                .addField("Original Duration", ms(rows[0].expiry - rows[0].start), false)
                .addField("Applied on", new Date(rows[0].start), false)
                .setTimestamp()

                unmutemember.send({embed: DMforcemuteExpiredEmbed})
                .catch(error => {
                    console.error(`Could not send help DM to a user.\n`, error);
                    receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                });

                if(rows[0].channel !== null) {
                    var channel = client.channels.get(rows[0].channel)
                    channel.overwritePermissions(unmutemember, {
                        SEND_MESSAGES: null
                    }, `Unmuted by ${receivedMessage.member.displayName}`)
                } else {
                    unmutemember.removeRole(muteRole)
                }
                
            }
            connection.query(sql, console.log)
        })
        



            
    }

};

