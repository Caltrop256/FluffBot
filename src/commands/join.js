const Discord = require('discord.js');


const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'join',
    aliases: ['summon', 'j'],
    description: 'Makes the bot join your current voicechannel',
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
        var botCurrentChannel = receivedMessage.guild.voiceConnection ? receivedMessage.guild.voiceConnection.channel : null
        var userVC = receivedMessage.member.voiceChannel

        if(!userVC) {
        	return receivedMessage.reply('You need to join a voice channel first!');
        } else if (userVC == botCurrentChannel) {
			return receivedMessage.reply(`I'm already connected to your voice channel!`);
        } else {
			receivedMessage.member.voiceChannel.join()
			.then(connection => {
			  receivedMessage.react(`✅`)
			})
			.catch(console.log);
        }  
    }
}