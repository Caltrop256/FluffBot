const Discord = require('discord.js');
const config = require('./json/config.json');
const fs = require('fs');


module.exports = {
    name: 'nickname',
    aliases: ['setnick', 'nick'],
    description: 'Changes the nickname of a specified user',
    args: true,
    usage: '<user> <new nickname>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    permLevel: 3, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

        var user = client.getMemberFromArg(receivedMessage, arguments, 0)
        if(!user) return receivedMessage.reply("Couldn't find User.")

        var OldNick = user.displayName

        var newNick = arguments.join(" ").slice(arguments[0].length).replace(/(:.+:)/gi, "\\$1")

        user.setNickname(newNick, `Commmand by ${receivedMessage.author.username}`)

        var nicknameChange = new Discord.RichEmbed()
        .setAuthor(`${user.user.tag}'s nickname Changed`, user.user.avatarURL, user.user.avatarURL)
        .setDescription(`\`${OldNick}\` => \`${newNick}\``)
        .setColor(user.displayHexColor)
        .setTimestamp()

        receivedMessage.channel.send({embed: nicknameChange})
    }
}

const embedNeon_Green = 0x1DFF2D