// typingStart
/* Emitted whenever a user starts typing in a channel.
PARAMETER      TYPE            DESCRIPTION
channel        Channel         The channel the user started typing in
user           User            The user that started typing    */

module.exports = {
    execute(client, channel, user)
    {
        client.lastSeen(user, `Started typing in #${channel.name}`)
    }
}