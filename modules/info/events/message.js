// message
/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
message        Message        The created message    */

module.exports = {
    execute(client, message) {
        client.lastSeen(message.author, `Sent a message in #${message.channel.name}`)
    }
}