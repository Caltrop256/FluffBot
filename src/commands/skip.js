const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube("AIzaSyB_EQsTT_1rjEKuB1ml279g1VDk03Kvpn4");

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: 'Skips one or multiple songs',
    args: false,
    usage: '',
    advUsage: '',
    guildOnly: true,
    rateLimit: {
        usages: 5,
        duration: 30,
        maxUsers: 3
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    async execute(client, arguments, receivedMessage) {
        if (!receivedMessage.member.voiceChannel) return receivedMessage.channel.send('You are not in a voice channel!');
		if (!client.serverQueue) return receivedMessage.channel.send('There is nothing playing that I could skip for you.');
		client.serverQueue.connection.dispatcher.end('Skip command has been used!');
    }
}