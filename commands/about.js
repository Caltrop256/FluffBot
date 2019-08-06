const Discord = require('discord.js');

module.exports = {
    name: 'about',
    aliases: ['whothis'],
    description: 'Shows a small about embed',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {
    receivedMessage.channel.send({embed: AboutEmbed})
   }
}

const embedNeon_Green = 0x1DFF2D

const AboutEmbed = new Discord.RichEmbed()
    .setTitle("made by and for the /r/fluffyboi community")
    .setAuthor("/r/fluffyboi Bot", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
    .setColor(embedNeon_Green)
    .setDescription("/r/fluffyboi is a private bot used for miscellaneous use and role-management.")
    .setFooter("made by Caltrop#0001, with friendly support from ChlodAlejandro#9493 and wac#5607.")
    .setThumbnail("https://i.imgur.com/T9ACLM2.png")
    .setTimestamp("")