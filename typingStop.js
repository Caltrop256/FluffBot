// typingStop
/* Emitted whenever a user stops typing in a channel.
PARAMETER       TYPE           DESCRIPTION
channel         Channel        The channel the user stopped typing in
user            User           The user that stopped typing    */

module.exports = (client, channel, user) => {
    
    if(channel.guild) {
        channel.guild.fetchMember(user).then((addedByMember) => {
            client.lastSeen(addedByMember, `Started typing in #${channel.name}`)
        })
    }
    
}