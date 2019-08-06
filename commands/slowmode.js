const Discord = require('discord.js');
const config = require("./json/config.json");



module.exports = {
    name: 'slowmode',
    aliases: ['sm', 'slow'],
    description: `Changes the rate limit per user for a specific channel`,
    args: true,
    usage: '<seconds> <#channel>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        var newRate = parseInt(arguments[0])
        if((!newRate && newRate !== 0) || (Math.sign(parseInt(newRate)) < 0 && newRate !== 0) || newRate > 21600) return receivedMessage.reply(`The Slowmode rate must be an integer number between 0 and 21600`)
        var channel = client.getChannelFromArg(receivedMessage, arguments, 1)
        var oldRate = channel.rateLimitPerUser

        channel.setRateLimitPerUser(newRate, `Command by ${receivedMessage.author.tag}`)

        rateLimitUpdateEmbed = new Discord.RichEmbed()
        .setAuthor(`Slowmode changed in #${channel.name}`, receivedMessage.author.avatarURL)
        .setDescription(`\`${oldRate}s\` => \`${newRate}s\``)
        .setColor(0x76C7F2)
        .setTimestamp()

        receivedMessage.channel.send({embed: rateLimitUpdateEmbed})

    }
}