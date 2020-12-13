// presenceUpdate
/* Emitted whenever a guild member's presence changes, or they change one of their details.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the presence update
newMember    GuildMember        The member after the presence update    */

module.exports = {
    execute(client, oldMember, newMember)
    {
        if (oldMember.presence.game != newMember.presence.game)
        {
            if (!newMember.presence.game) { client.lastSeen(newMember, `stopped playing \"${oldMember.presence.game}\"`) } else { client.lastSeen(newMember, `started playing \"${newMember.presence.game}\"`) }
        }
        if (oldMember.presence.status != newMember.presence.status)
        {
            client.lastSeen(newMember, `went ${newMember.presence.status}`)
        }
        if (oldMember.presence.status == newMember.presence.status && oldMember.presence.game == newMember.presence.game)
        {
            client.lastSeen(newMember, `started using a different device`)
        }
    }
}

