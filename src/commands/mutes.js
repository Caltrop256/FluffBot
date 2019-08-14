const Discord = require('discord.js');
const config = require("./json/config.json");
const prettyMs = require('pretty-ms');
var ordinal = require('ordinal-number-suffix')
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
    name: 'mutes',
    aliases: ['displaymutes'],
    description: 'Shows every muted User and their remaining time',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
        usages: 1,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
    connection.query(`SELECT * FROM mute;`, async (err, rows) => {
            if(err) throw err;

            var leaderboardEmbed = new Discord.RichEmbed()
            .setAuthor(`Muted Users`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
            .setDescription(`Below you will find a list of all ${rows.length} muted users in ${receivedMessage.guild.name}`)
            .setColor(0x74B979)
            
            var LeaderBoard = ''


            await rows.forEach(row => {
                var rowMember = receivedMessage.guild.members.get(row.id)
                var invokingMember = receivedMessage.guild.members.get(row.invokinguser)
                LeaderBoard = LeaderBoard + `\`${ordinal(rows.indexOf(row) + 1)}:\` ${rowMember} - By: ${invokingMember}, Duration: \`${prettyMs(row.expiry - row.start, {verbose: true, compact: true})}\`, Expires in: \`${prettyMs(row.expiry - Date.now(), {verbose: true, compact: true})}\`\n`
            })

            var LeaderboardArray = LeaderBoard.split('\n')

            LeaderboardArray.length = LeaderboardArray.length - 1

            while (LeaderboardArray.length > 0) {

                chunk = LeaderboardArray.splice(0, 5)

                leaderboardEmbed.addField("Muted Users", chunk)
            }

            /*if(LeaderBoard.length > 1022) {
                return receivedMessage.reply("Limit was too high.")
            }*/

            receivedMessage.reply("I have sent you a list of all muted members.")
            receivedMessage.author.send({embed: leaderboardEmbed})
            .catch(error => {
                console.error(`Could not send help DM to a user.\n`, error);
                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
            });
        })
    }
};

