const Discord = require('discord.js');
const prettyMs = require('pretty-ms');
var ordinal = require('ordinal-number-suffix')

module.exports = {
    name: 'mutes',
    aliases: ['displaymutes'],
    description: 'Shows every muted User and their remaining time',
    args: false,
    usage: '',
    rateLimit: {
        usages: 1,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MUTE_MEMBERS'],


    execute(client, args, message)
    {
        var connection = client.scripts.getSQL();
        connection.query(`SELECT * FROM mute;`, async (err, rows) =>
        {
            if (err) throw err;

            var leaderboardEmbed = new Discord.RichEmbed()
                .setAuthor(`Muted Users`, message.author.avatarURL, message.author.avatarURL)
                .setDescription(`Below you will find a list of all ${rows.length} muted users in ${message.guild.name}`)
                .setColor(client.constants.green.hex)


            await rows.forEach(row =>
            {
                var rowMember = message.guild.members.get(row.id)
                var invokingMember = message.guild.members.get(row.invokinguser)

                if (rowMember && invokingMember)
                {
                    leaderboardEmbed.addField(rowMember.user.tag, `${row.channel ? `Muted in ${client.channels.get(row.channel).toString()}` : 'Muted globally'}\n${invokingMember.id == rowMember.id ? 'Selfmute' : 'Muted by ' + invokingMember.toString()}\nDuration: \`${client.time(row.expiry - row.start, true)}\`\n Expires in: \`${client.time(row.expiry - Date.now(), true)}\``, true)
                }

            })

            var user = message.author;
            user.createDM().then(DM =>
            {
                DM.send({ embed: leaderboardEmbed })
                    .then(() => message.reply("I have sent you a list of all muted members."))
                    .catch(() =>
                        message.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                    );
            });
        })
    }
};