const Discord = require('discord.js');
const config = require("./json/config.json");


module.exports = {
    name: 'topic',
    aliases: ['ct', 'channeltopic'],
    description: 'Displays the channel topic',
    args: false,
    usage: '<#channel>',
    guildOnly: false,
    rateLimit: {
        usages: 3,
        duration: 20,
        maxUsers: 3
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        var channel = client.getChannelFromArg(receivedMessage, arguments)

        var topicEmbed = new Discord.RichEmbed()
        .setAuthor(`Topic of #${channel.name}`)
        .setDescription(`${channel.topic}`)
        .setColor(0x76FF7B)

        receivedMessage.channel.send({embed: topicEmbed})
    }
}