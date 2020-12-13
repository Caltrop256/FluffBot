'use strict';


// voiceStateUpdate
/* Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
PARAMETER              TYPE                   DESCRIPTION
oldMember	        GuildMember	        The member before the voice state update
newMember	        GuildMember	        The member after the voice state update */

module.exports = {
    execute(client, oldMember, newMember)
    {
        if (!client.monke)
            return;
        if (oldMember.voiceChannelID)
            return;
        if (newMember.voiceChannelID !== '562324876837388454')
            return;
        if (client.voiceConnections.has('562324876330008576'))
            return;
        let talkingChannel = newMember.voiceChannel;
        talkingChannel.join().then(connection =>
        {
            const dispatcher = connection.playArbitraryInput('https://tropbot.cheeseboye.com/monke.mp3');
            dispatcher.on('end', () =>
            {
                talkingChannel.leave();
            });
            dispatcher.on('error', err =>
            {
                console.error(`[VOICE ERROR] ${err}`);
                talkingChannel.leave();
            });
            dispatcher.setVolume(2);
        });
    }
};