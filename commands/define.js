const Discord = require('discord.js');
const urban = require('relevant-urban');
const smartTruncate = require('smart-truncate');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'define',
    aliases: ['urban'],
    description: 'defines a word',
    args: true,
    usage: 'word',
    guildOnly: false,
    rateLimit: {
        usages: 3,
        duration: 30,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        urban(encodeURI(arguments.join(" "))).then(definition => {
            if(!definition) return receivedMessage.reply("couldn't find a definition for your word.")

            var LikeRatio = Math.round(definition.thumbsUp / (definition.thumbsUp + definition.thumbsDown) * 100)
            if(isNaN(LikeRatio)) LikeRatio = 0

            var DefinitionEmbed = new Discord.RichEmbed()
            .setAuthor(`Definition for "${definition.word}"`, receivedMessage.author.avatarURL, definition.urbanURL)
            .setDescription(`**Definition**: ${smartTruncate(definition.definition.replace(/[\[\]]/gi, ""), 1000)}\n\n**Example**: ${smartTruncate(definition.example.replace(/[\[\]]/gi, ""), 1000)}`)
            .setFooter(`${LikeRatio}% of people agreed with this Definition.`)
            .setColor(0x007CFF)

            receivedMessage.channel.send({embed: DefinitionEmbed})
        }).catch(error => {
            console.log(error)
            return receivedMessage.reply("couldn't find a definition for your word.")
        })

    }
}