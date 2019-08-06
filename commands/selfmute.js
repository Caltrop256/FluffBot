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


module.exports = {
    name: 'selfmute',
    aliases: ['h'],
    description: 'Mutes the User for a selected amount of time',
    args: true,
    usage: '<time>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {


        var mutelist = []

        let selfmutemember = receivedMessage.member
        let muteRole = receivedMessage.guild.roles.get("562364319761956875")
        if(!muteRole) return receivedMessage.reply("Mute Role not found.")
        let params = receivedMessage.content.split(" ").slice(1);
        let time = ms(params[0])
        if(!time) return receivedMessage.reply("No time arguments received.")
        let timeShow = time + "ms"


        if(selfmutemember.roles.has(muteRole.id)) return receivedMessage.reply("You are already muted. (wait what?)")

        if(time < 600000 * 3) return receivedMessage.reply("Selfmutes must at least be 30 minutes long.")

        if(time > 473354280000) return receivedMessage.reply("Selfmutes must be shorter than 15 years.")

        selfmutemember.addRole(muteRole.id, "Selfmute")
        receivedMessage.author.send("You have been muted for " + prettyMs(time, {verbose: true, compact: true}) + "\nSee you soon <:neon_pink_heart:567312233923870751>")
        .catch(error => {
            console.error(`Could not send help DM to a user.\n`, error);
            receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
        });
        receivedMessage.channel.send(receivedMessage.author + " has been muted for " + prettyMs(time, {verbose: true, compact: true}) + "\nSee you soon <:neon_pink_heart:567312233923870751>")

        let muteGuild = receivedMessage.guild.id

        connection.query(`SELECT * FROM mute WHERE id = '${selfmutemember.id}'`, (err, rows) => {
            if(err) throw err;
            let sql;
            if(rows.length < 1) {
                sql = `INSERT INTO mute (id, invokinguser, expiry, guild, start, selfmute) VALUES ('${selfmutemember.id}', '${receivedMessage.author.id}', ${Date.now() + time}, '${muteGuild}', ${Date.now()}, ${1})`
            } else {
                return receivedMessage.reply(`The user already has an entry in the mute Database.\nPlease do \`${client.cfg.prefix}unmute <@user>\``)
            }
            connection.query(sql, console.log)
        })

        let muteChannel = client.channels.get("562338340918001684");



        var muteEmbed = new Discord.RichEmbed()
            .setColor(0x74B979)
            .setAuthor("Event: #" )
            .setTitle("User mute")
            .addField("Guild", receivedMessage.guild)
            .addField("User", selfmutemember)
            .addField("Moderator", "TropBot (selfmute)")
            .addField("Duration", prettyMs(time, {verbose: true, compact: true}))
            .setTimestamp()

        muteChannel.send({embed: muteEmbed})

        
        

        
    }
};

