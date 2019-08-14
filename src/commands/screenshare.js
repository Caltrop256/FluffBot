const Discord = require('discord.js');
const config = require("./json/config.json");

module.exports = {
    name: 'screenshare',
    aliases: ['screensharelink', 'sharescreen'],
    description: 'Sends a link to enable screensharing',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {
       
        if (receivedMessage.member.voiceChannel) {
            let sclink = `https://discordapp.com/channels/${receivedMessage.guild.id}/${receivedMessage.member.voiceChannel.id}`
            receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Screensharing - " + receivedMessage.member.voiceChannel.name, receivedMessage.member.avatar, sclink).setDescription(`[Click here](${sclink}) to enable the screensharing and voice call interface.\nNote: this may not work well on mobile or with BetterDiscord.`).setColor(embedGreen));
        }
        if (!receivedMessage.member.voiceChannel) {return receivedMessage.reply("You need to be in a voice channel to use this Command")}
    }
}

const embedGreen = 0x74B979