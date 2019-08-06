const Discord = require('discord.js');


const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'disconnect',
    aliases: ['dc', 'leave'],
    description: 'Makes the bot leave your current voice channel',
    args: false,
    usage: '',
    advUsage: '',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 120,
        maxUsers: 3
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

        if(!receivedMessage.guild.voiceConnection) {
        	return receivedMessage.reply(`I'm not connected to any voice channels!`);
        } else {
            receivedMessage.guild.voiceConnection.disconnect()
            receivedMessage.channel.send(`Disconnected.`)
        }
    }
}