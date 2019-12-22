'use strict';

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
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_EMOJIS'],

async execute(client, args, message) {
        
        var linkArg = args[0]
        var namingArgs = args[1]

        
        if(linkArg && namingArgs) {
            if(namingArgs.length > 32) return message.reply(`Max naming length is 32 characters.`)
            message.guild.createEmoji(linkArg, namingArgs)
            .then(emoji => {
                var newEmojiEmbed = client.scripts.getEmbed()
                .setAuthor(`Succesfully added :${namingArgs}:`, emoji.url)
                .setThumbnail(emoji.url)
                .setColor(0x74B979)
                .setFooter("ID: " + emoji.id)
                .setTimestamp()

                message.channel.send({embed: newEmojiEmbed}).then(msg => {
                    msg.react(emoji);
                });
            })
            .catch(err => {
                return message.reply("There was an Error while adding your emote: " + err)
            });
        } else {message.reply("Please provide a valid link and name for your Emote.")}
            
    }
};