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
    name: 'mute',
    aliases: ['lmute', 'longmute', 'naenae'],
    description: 'Mutes a selected user for a specific amount of time',
    args: true,
    usage: '<@user> <time> <#channel>',
    guildOnly: true,
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {


        let mutemember = client.getMemberFromArg(receivedMessage, arguments)
        if(!mutemember) return receivedMessage.reply("You haven't specified a User.")
        var channel = arguments[2] ? client.getChannelFromArg(receivedMessage, arguments, 2) : null
        let muteRole = receivedMessage.guild.roles.get("562364319761956875")
        if(!muteRole) return receivedMessage.reply("Mute Role not found.")
        let params = receivedMessage.content.split(" ").slice(1);
        let time = ms(params[1])
        if(!time) return receivedMessage.reply("No time arguments received.")

        if(time < 60000 ) return receivedMessage.reply("Mutes be at least 1 minute long.")

        if(time > 473354280000 ) return receivedMessage.reply("Mutes must be shorter than 15 years.")

        if(mutemember.roles.has(muteRole.id)) return receivedMessage.reply("The User is already Muted.")

        if(channel) {
            channel.overwritePermissions(mutemember, {
                SEND_MESSAGES: false
            }, `Muted by ${receivedMessage.member.displayName}`)
        } else {
            mutemember.addRole(muteRole.id, `Muted by ${receivedMessage.member.displayName}`)
        }
        receivedMessage.author.send(mutemember.user.tag + " has been muted for " + prettyMs(time, {verbose: true, compact: true}))
        .catch(error => {
            console.error(`Could not send help DM to a user.\n`, error);
            receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
        });

        let muteGuild = receivedMessage.guild.id

        var FailBreak = false

        connection.query(`SELECT * FROM mute WHERE id = '${mutemember.id}'`, (err, rows) => {
            if(err) throw err;
            let sql;
            if(rows.length < 1) {
                if(channel) {
                    sql = `INSERT INTO mute (id, invokinguser, expiry, guild, start, selfmute, channel) VALUES ('${mutemember.id}', '${receivedMessage.author.id}', ${Date.now() + time}, '${muteGuild}', ${Date.now()}, ${0}, '${channel.id}')`
                } else {
                    sql = `INSERT INTO mute (id, invokinguser, expiry, guild, start, selfmute) VALUES ('${mutemember.id}', '${receivedMessage.author.id}', ${Date.now() + time}, '${muteGuild}', ${Date.now()}, ${0})`
                }
            } else {
                FailBreak = true
                return receivedMessage.reply(`The user already has an entry in the mute Database.\nPlease do \`${client.cfg.prefix}unmute <@user>\``)
            }
            connection.query(sql, console.log)
        })

        if(FailBreak == true) {
            return
        }

        let muteChannel = client.channels.get("562338340918001684");


        var muteEmbed = new Discord.RichEmbed()
            .setColor(embedGreen)
            .setAuthor("Event: #")
            .setTitle("User mute")
            .addField("Guild", receivedMessage.guild)
            .addField("User", mutemember)
            .addField("Moderator", receivedMessage.author)
            .addField("Duration", prettyMs(time, {verbose: true, compact: true}))
            .setTimestamp();

        var DMmuteEmbed = new Discord.RichEmbed()
            .setColor(embedRed)
            .setAuthor("You have been muted")
            .addField("Guild", receivedMessage.guild)
            .addField("User (you)", mutemember)
            .addField("Moderator", receivedMessage.author)
            .addField("Duration", prettyMs(time, {verbose: true, compact: true}))
            .setTimestamp();

        if(channel) {
            muteEmbed.setDescription(`This mute only applies to ${channel.toString()}`)
            DMmuteEmbed.setDescription(`This mute only applies to ${channel.toString()}`)
        }

        muteChannel.send({embed: muteEmbed})


        mutemember.send({embed: DMmuteEmbed})
        .catch(error => {
            console.error(`Could not send help DM to a user.\n`, error);
            receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
        });


        
        

        
    }
};

