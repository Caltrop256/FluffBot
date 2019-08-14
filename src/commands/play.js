const Discord = require('discord.js');
const config = require("./json/config.json");
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube(config.ytApiToken);

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'play',
    aliases: ['p', 'pl', 'add'],
    description: 'Adds a song to the Queue',
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
        const url = arguments[0] ? arguments[0].replace(/<(.+)>/g, '$1') : '';
        const searchString = arguments.join(" ")

		const voiceChannel = receivedMessage.member.voiceChannel;
		if (!voiceChannel) return receivedMessage.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(receivedMessage.client.user);
		if (!permissions.has('CONNECT')) {
			return receivedMessage.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return receivedMessage.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, receivedMessage, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return receivedMessage.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					receivedMessage.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await receivedMessage.channel.awaitMessages(receivedMessage2 => receivedMessage2.content > 0 && receivedMessage2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return receivedMessage.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return receivedMessage.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return client.handleVideo(video, receivedMessage, voiceChannel);
		}
    }
}