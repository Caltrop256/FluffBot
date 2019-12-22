// messageReactionRemove
/* Emitted whenever a reaction is removed from a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that removed the emoji or reaction emoji     */

module.exports = {
    execute(client, reaction, user) {
        client.lastSeen(user, `Removed a reaction from a message in #${reaction.message.channel.name}`)
    }
};