const Discord = require('discord.js');
const config = require("./json/config.json");
var ordinal = require('ordinal-number-suffix')
const prettyMs = require('pretty-ms');
var NumAbbr = require('number-abbreviate')
var numAbbr = new NumAbbr()
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
    name: 'leftusers',
    aliases: ['leaveusers', 'left', 'leaves'],
    description: 'Displays all left Members',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
        usages: 1,
        duration: 30,
        maxUsers: 2
    },
    permLevel: 1, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    async execute(client, arguments, receivedMessage) {

        if(arguments.length) {
            var Limit = arguments[0]
        } else {
            var Limit = 10
        }
        if(Math.sign(parseInt(Limit)) < 1) {return receivedMessage.reply("nice try.")}



        connection.query(`SELECT * FROM leaveInfo;`, async (err, rows) => {
            if(err) throw err;

            var leaderboardEmbed = new Discord.RichEmbed()
            .setAuthor(`Top ${rows.length} Members, who have left`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
            .setDescription(`Below you will find a list of ${receivedMessage.guild.name}'s ${rows.length} Members who have left the server.`)
            .setColor(0x74B979)
            
            var LeaderBoard = ''

            await rows.forEach(row => {
                var rowMember = receivedMessage.guild.members.get(row.id)
                LeaderBoard = LeaderBoard + `\`${ordinal(rows.indexOf(row) + 1)}:\` ${row.username} - \`${prettyMs(Date.now() - row.leftdate, {verbose: true, compact: true})} ago\`\n`
            })

            var LeaderboardArray = LeaderBoard.split('\n')

            LeaderboardArray.length = LeaderboardArray.length - 1

            while (LeaderboardArray.length > 0) {

                chunk = LeaderboardArray.splice(0, 10)

                leaderboardEmbed.addField("Leaderboard", chunk)
              }

            /*if(LeaderBoard.length > 1022) {
                return receivedMessage.reply("Limit was too high.")
            }*/

            receivedMessage.channel.send({embed: leaderboardEmbed})
        })
    }
}