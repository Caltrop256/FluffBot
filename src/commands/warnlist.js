const Discord = require('discord.js');
const config = require("./json/config.json");
var ordinal = require('ordinal-number-suffix')
var NumAbbr = require('number-abbreviate')
const prettyMs = require('pretty-ms');
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
    name: 'warnlist',
    aliases: ['allwarns'],
    description: 'Displays all warns',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    async execute(client, arguments, receivedMessage) {

        connection.query(`SELECT * FROM warn;`, async (err, rows) => {
            if(err) throw err;

            var leaderboardEmbed = new Discord.RichEmbed()
            .setAuthor(`All ${rows.length} warns`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
            .setDescription(`Below you will find a list of ${receivedMessage.guild.name}'s all ${rows.length} warns\n\`Warn Level \`|\` User \`|\` Active \`|\` Mod \`|\` Expires in \`|\` Applied \`|\` Warn ID\``)
            .setColor(0x74B979)
            
            var LeaderBoard = ''


            await rows.forEach(row => {
                var rowMember = receivedMessage.guild.members.get(row.userid)
                var invokingMember = receivedMessage.guild.members.get(row.invokinguser)

                LeaderBoard = LeaderBoard + `\`${row.warnid}\`|${rowMember}|\`${row.active}\`|${invokingMember}|\`${prettyMs(row.expiry - Date.now(), {verbose: true, compact: true})}\`|\`${prettyMs( Date.now() - row.applied, {verbose: true, compact: true})} ago\`|\`${row.randid} \`\n`
            })

            var LeaderboardArray = LeaderBoard.split('\n')

            LeaderboardArray.length = LeaderboardArray.length - 1

            while (LeaderboardArray.length > 0) {

                chunk = LeaderboardArray.splice(0, 10)

                leaderboardEmbed.addField("Warns", chunk)
              }

            /*if(LeaderBoard.length > 1022) {
                return receivedMessage.reply("Limit was too high.")
            }*/

            receivedMessage.reply("I have sent you a list of all warns.")
            receivedMessage.author.send({embed: leaderboardEmbed})
            .catch(error => {
                console.error(`Could not send help DM to a user.\n`, error);
                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
            });
        })
    }
}