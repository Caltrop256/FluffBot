module.exports = {
    name: 'daisy',
    aliases: ['dbell', 'bell'],
    description: 'Music Thing',
    args: false,
    usage: '',
    rateLimit: {
        usages: 1,
        duration: 32,
        maxUsers: 1
    },
    perms: [],

    execute(client, args, message)
    {
        if (!message.guild)
            return;
        if (!message.member.voiceChannelID)
            return;
        if (client.voiceConnections.has('562324876330008576'))
            return;
        if (client.isPlayingDaisy)
            return;
        let talkingChannel = message.member.voiceChannel;
        talkingChannel.join().then(connection =>
        {
            const dispatcher = connection.playArbitraryInput('https://tropbot.cheeseboye.com/daisy.mp3');
            //dispatcher.on('end', () => {
            setTimeout(() =>
            {
                client.isPlayingDaisy = false;
                talkingChannel.leave();
            }, 32000);
            dispatcher.on('error', err =>
            {
                console.error(`[VOICE ERROR] ${err}`);
                client.isPlayingDaisy = false;
                talkingChannel.leave();
            });
            client.isPlayingDaisy = true;
            dispatcher.setVolume(1);
        });
    }
}

