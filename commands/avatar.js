const Discord = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['av', 'pfp'],
    description: 'Links and displays the avatar of a user',
    args: false,
    usage: 'user',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 5
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
    execute(client, arguments, receivedMessage) {
        var user = client.getMemberFromArg(receivedMessage, arguments, 0)
        if(!user) return receivedMessage.reply("Couldn't find User.")

        var avatarEmbed = new Discord.RichEmbed()
        .setAuthor(`${user.user.tag}'s Avatar`, user.user.displayAvatarURL, user.user.displayAvatarURL)
        .setImage(user.user.displayAvatarURL)
        .setTimestamp()
        .setColor(embedNeon_Green)

        receivedMessage.channel.send(`Link => <${user.user.displayAvatarURL}>`, {embed: avatarEmbed})
   }
}

const embedNeon_Green = 0x1DFF2D

