const Discord = require('discord.js');
const fs = require('fs');
var Jimp = require('jimp');

module.exports = {
    name: 'emojify',
    aliases: ['emotify'],
    description: 'Converts an image url to an Emote',
    args: true,
    usage: '<url> <"emote name">',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

async execute(client, arguments, receivedMessage) {
        
        var linkArg = arguments.join(" ").match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpe?g|gif|png)/gi)
        var namingArgs = arguments.join(" ").match(/(?<=").*(?=")/ig)

        
        if(linkArg && namingArgs) {
            if(namingArgs[0].length > 32) return receivedMessage.reply(`Max naming length is 32 characters.`)
            receivedMessage.guild.createEmoji(linkArg[0], namingArgs[0])
            .then(emoji => {
                var newEmojiEmbed = new Discord.RichEmbed()
                .setAuthor(`Succesfully added :${namingArgs[0]}:`, emoji.url)
                .setThumbnail(emoji.url)
                .setColor(0x74B979)
                .setFooter("ID: " + emoji.id)
                .setTimestamp()

                receivedMessage.channel.send({embed: newEmojiEmbed})
            })
            .catch(err => {
                return receivedMessage.reply("There was an Error while adding your emote: " + err)
            });
        } else {receivedMessage.reply("Please provide a valid link and name for your Emote.")}
            
    }
};