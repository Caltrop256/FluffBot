const Discord = require('discord.js');
const config = require("./json/config.json");
var ordinal = require('ordinal-number-suffix')
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
    name: 'warn',
    aliases: ['w'],
    description: 'Warns a selected user',
    args: true,
    usage: '<@user> <reason>',
    guildOnly: true,
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {

    const ExpireConstant = 1209600000
    //const ExpireConstant = 50000

    let warnUser = client.getMemberFromArg(receivedMessage, arguments)
    if(!warnUser) return receivedMessage.reply("Couldn't find specified user");

    let reason = arguments.join(" ").slice(client.cfg.prefix.length + arguments[0].length);
    if(!reason) {return receivedMessage.reply("Please provide a reason for the warn.")}

    connection.query(`SELECT * FROM warn WHERE userid = '${warnUser.id}' AND active = 1`, (err, rows) => {
        if(err) throw err;
        let sql;

        var curWarnID = rows.length + 1

        sql = `INSERT INTO warn (warnid, userid, reason, active, invokinguser, expiry, applied, guild, randid) VALUES (${curWarnID}, '${warnUser.id}', '${reason}', ${1}, '${receivedMessage.author.id}', ${Date.now() + ExpireConstant}, ${Date.now()}, '${receivedMessage.guild.id}', ${Math.floor(Math.random() * 10000)})`

        connection.query(sql, console.log)

        let warnChannel = client.channels.get("562338340918001684");
        let muteRole = receivedMessage.guild.roles.get("562364319761956875")

        var warnEmbed = new Discord.RichEmbed()
        .setColor(embedRed)
        .setAuthor("Event: #")
        .setTitle("User Warn")
        .setDescription(`This is ${warnUser.displayName}'s ${ordinal(curWarnID)} warn.`)
        .addField("Guild", receivedMessage.guild)
        .addField("User", warnUser)
        .addField("Moderator", receivedMessage.author)
        .addField("Reason", reason)
        .addField("Expires in", prettyMs(ExpireConstant, {verbose: true, compact: true}))
        .setTimestamp()


        var DMwarnEmbed = new Discord.RichEmbed()
        .setColor(embedRed)
        .setAuthor("You have been warned")
        .setDescription(`This is your ${ordinal(curWarnID)} active Warn.`)
        .addField("Guild", receivedMessage.guild)
        .addField("Moderator", receivedMessage.author)
        .addField("Reason", reason)
        .addField("Expires in", prettyMs(ExpireConstant, {verbose: true, compact: true}))
        .setTimestamp()

        if(curWarnID == 3) {
            DMwarnEmbed.addField("Additional Punishment", "1 hour mute")
            warnEmbed.addField("Additional Punishment", "1 hour mute")

            var time = 3600000

            warnUser.addRole(muteRole.id, `Muted by ${receivedMessage.member.displayName}`)
            receivedMessage.author.send(warnUser.user.tag + " has been muted for " + prettyMs(time, {verbose: true, compact: true}))
            .catch(error => {
                console.error(`Could not send help DM to a user.\n`, error);
                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
            });
    
            let muteGuild = receivedMessage.guild.id

            connection.query(`SELECT * FROM mute WHERE id = '${warnUser.id}'`, (err, rows) => {
                if(err) throw err;
                let sql;
                if(rows.length < 1) {
                    sql = `INSERT INTO mute (id, invokinguser, expiry, guild, start) VALUES ('${warnUser.id}', '${receivedMessage.author.id}', ${Date.now() + time}, '${muteGuild}', ${Date.now()})`
                } else {
                    return receivedMessage.reply(`The user already has an entry in the mute Database.\nPlease do \`${client.cfg.prefix}unmute <@user>\` if you want to manually set the new mute time.`)
                }
                connection.query(sql, console.log)
            })
        }
        if(curWarnID == 4) {
            DMwarnEmbed.addField("Additional Punishment", "1 day mute")
            warnEmbed.addField("Additional Punishment", "1 day mute")

            var time = 3600000 * 24

            warnUser.addRole(muteRole.id, `Muted by ${receivedMessage.member.displayName}`)
            receivedMessage.author.send(warnUser.user.tag + " has been muted for " + prettyMs(time, {verbose: true, compact: true}))
            .catch(error => {
                console.error(`Could not send help DM to a user.\n`, error);
                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
            });
    
            let muteGuild = receivedMessage.guild.id

            connection.query(`SELECT * FROM mute WHERE id = '${warnUser.id}'`, (err, rows) => {
                if(err) throw err;
                let sql;
                if(rows.length < 1) {
                    sql = `INSERT INTO mute (id, invokinguser, expiry, guild, start) VALUES ('${warnUser.id}', '${receivedMessage.author.id}', ${Date.now() + time}, '${muteGuild}', ${Date.now()})`
                } else {
                    return receivedMessage.reply(`The user already has an entry in the mute Database.\nPlease do \`${client.cfg.prefix}unmute <@user>\` if you want to manually set the new mute time.`)
                }
                connection.query(sql, console.log)
            })
        }
        if(curWarnID == 5) {
            DMwarnEmbed.addField("Additional Punishment", "1 week mute")
            warnEmbed.addField("Additional Punishment", "1 week mute")

            var time = (3600000 * 24) * 7

            warnUser.addRole(muteRole.id, `Muted by ${receivedMessage.member.displayName}`)
            receivedMessage.author.send(warnUser.user.tag + " has been muted for " + prettyMs(time, {verbose: true, compact: true}))
            .catch(error => {
                console.error(`Could not send help DM to a user.\n`, error);
                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
            });
    
            let muteGuild = receivedMessage.guild.id

            connection.query(`SELECT * FROM mute WHERE id = '${warnUser.id}'`, (err, rows) => {
                if(err) throw err;
                let sql;
                if(rows.length < 1) {
                    sql = `INSERT INTO mute (id, invokinguser, expiry, guild, start) VALUES ('${warnUser.id}', '${receivedMessage.author.id}', ${Date.now() + time}, '${muteGuild}', ${Date.now()})`
                } else {
                    return receivedMessage.reply(`The user already has an entry in the mute Database.\nPlease do \`${client.cfg.prefix}unmute <@user>\` if you want to manually set the new mute time.`)
                }
                connection.query(sql, console.log)
            })
        }
        if(curWarnID >= 6) {
            DMwarnEmbed.addField("Additional Punishment", "Permanent Ban")
            warnEmbed.addField("Additional Punishment", "Permanent Ban")

            warnUser.ban({
                reason: "reached warn level 6"
              });
        }
        if(curWarnID <= 2) {
            DMwarnEmbed.addField("Additional Punishment", "none")
            warnEmbed.addField("Additional Punishment", "none")
        }

        warnChannel.send({embed: warnEmbed})
        warnUser.send({embed: DMwarnEmbed})
    })
    
   }
}