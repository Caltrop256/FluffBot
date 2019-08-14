const Discord = require('discord.js');
const smartTruncate = require('smart-truncate');
const prettyMs = require('pretty-ms');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'unban',
    aliases: ['removeban', 'pardon'],
    description: 'Unbans a User',
    args: true,
    usage: '<UserID>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 1, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

execute(client, arguments, receivedMessage) {

        var id = arguments[0]

        client.fetchUser(id, true).then(user => {
            if(!user) return receivedMessage.reply("Please provide a valid ID")
            receivedMessage.guild.unban(user, `Unbanned by ${receivedMessage.author.username}`)

            const logs = client.channels.get("562338340918001684")

            let unbanEmbed = new Discord.RichEmbed()
            .setDescription("User unban")
            .setAuthor("Event: #" )
            .setColor(embedGreen)
            .addField("Guild", receivedMessage.guild.toString())
            .addField("Moderator", receivedMessage.author)
            .addField("Unbanned User", user)
            .addField("Unbanned In", receivedMessage.channel)
            .setTimestamp();

            logs.send({embed: unbanembed})
        })

    }
}


