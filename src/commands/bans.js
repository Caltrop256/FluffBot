const Discord = require('discord.js');
const smartTruncate = require('smart-truncate');
const prettyMs = require('pretty-ms');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'bans',
    aliases: ['allbans', 'banlist'],
    description: 'Shows all banned users',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 1
    },
    permLevel: 1, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        receivedMessage.guild.fetchBans([true]).then(async bans => {
            console.log(bans)

            var leaderboardEmbed = new Discord.RichEmbed()
            .setAuthor(`All ${bans.size} banned Users`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
            .setDescription(`Below you will find a list of ${receivedMessage.guild.name} ${bans.size} banned Users`)
            .setColor(0x74B979)
            
            var LeaderBoard = ''

            await bans.forEach(ban => {
                LeaderBoard = LeaderBoard + `**${ban.user.username}#${ban.user.discriminator}** - \`${ban.reason}\`\n`
            })

            var itteration = 0

            var LeaderboardArray = LeaderBoard.split('\n')

            LeaderboardArray.length = LeaderboardArray.length - 1

            while (LeaderboardArray.length > 0) {
                itteration++

                chunk = LeaderboardArray.splice(0, 10)

                if(itteration < 2) {leaderboardEmbed.addField("Bans", chunk)}
                else leaderboardEmbed.addField("󠀡", chunk)
              }

            receivedMessage.channel.send({embed: leaderboardEmbed})
        })
    }
}


