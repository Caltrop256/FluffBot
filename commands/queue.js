const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube("AIzaSyB_EQsTT_1rjEKuB1ml279g1VDk03Kvpn4");

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'queue',
    aliases: ['q', 'songs'],
    description: 'Displays the current queue',
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

        const serverQueue = client.queue.get(receivedMessage.guild.id);
        console.log(serverQueue.songs)

        receivedMessage.channel.send(`
__**Song queue:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}`)
    }
}