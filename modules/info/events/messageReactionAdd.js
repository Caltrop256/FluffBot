// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */

module.exports = {
    execute(client, reaction, user) {
        client.lastSeen(user, `Adding a reaction to a message in #${reaction.message.channel.name}`)
    }
};