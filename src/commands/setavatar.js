const Discord = require('discord.js');
const config = require('./json/config.json');
const fs = require('fs');


module.exports = {
    name: 'setavatar',
    aliases: ['setpfp'],
    description: 'Changes the Avatar of the Bot',
    args: false,
    usage: '<link to image>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 500,
        maxUsers: 10
    },
    permLevel: 3, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

        if(!arguments.length) {
            var ValidURL = client.user.avatarURL

            var AvatarCurrentEmbed = new Discord.RichEmbed()
            .setAuthor("Here is my current avatar!")
            .setImage(`${ValidURL}`)
            .setColor(embedNeon_Green)

            return receivedMessage.channel.send({embed: AvatarCurrentEmbed})
        }

        var imgURL = arguments[0]
        if(imgURL.toString().endsWith(".jpeg") || imgURL.toString().endsWith(".jpg") || imgURL.toString().endsWith(".png") || imgURL.toString().endsWith(".gif") || imgURL.toString().endsWith(".gifv")) {
            var ValidURL = imgURL.toString()
        }
        if(!ValidURL) {return receivedMessage.channel.send("Not a valid Image URL")}

        if(ValidURL) {
            client.user.setAvatar(`${ValidURL}`).catch(err => console.log(err));

            var AvatarUpdateEmbed = new Discord.RichEmbed()
            .setAuthor("Successfully updated Avatar")
            .setImage(`${ValidURL}`)
            .setColor(embedNeon_Green)

            receivedMessage.channel.send({embed: AvatarUpdateEmbed})
        }

        receivedMessage.delete(300)

    }
}

const embedNeon_Green = 0x1DFF2D