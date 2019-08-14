const Discord = require('discord.js');
const config = require('./json/config.json');
const fs = require('fs');


module.exports = {
    name: 'setname',
    aliases: ['name', 'username', 'setusername'],
    description: 'Changes the Name of the Bot',
    args: true,
    usage: '<new name>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 500,
        maxUsers: 10
    },
    permLevel: 3, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

        var newname = arguments.join(" ")
        if(newname.length < 2 || newname.length > 32) {return receivedMessage.reply("Usernames must be between 2 and 32 characters long.")}

        try {client.user.setUsername(`${newname}`)

        var nameUpdateEmbed = new Discord.RichEmbed()
        .setAuthor("Successfully updated Name")
        .setTitle("new name: `" + newname + "`")
        .setColor(embedNeon_Green)

        receivedMessage.channel.send({embed: nameUpdateEmbed})

        } catch (error) {
            console.error(error);
        }
    }
}

const embedNeon_Green = 0x1DFF2D