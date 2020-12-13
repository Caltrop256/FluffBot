// voiceStateUpdate
/* Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
PARAMETER    TYPE             DESCRIPTION
oldMember    GuildMember      The member before the voice state update
newMember    GuildMember      The member after the voice state update    */

module.exports = {
    execute(client, oldMember, newMember)
    {
        client.lastSeen(newMember, `Being active in voicechat`)

        if (newMember.voiceChannelID)
        {
            if (!newMember.roles.has("598883824830513152")) newMember.addRole("598883824830513152", "joined voice")
        } else if (newMember.roles.has("598883824830513152")) newMember.removeRole("598883824830513152", "left voice")
    }
};