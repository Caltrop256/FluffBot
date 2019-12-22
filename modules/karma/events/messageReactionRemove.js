//'use strict';

// messageReactionRemove
/* Emitted whenever a reaction is removed from a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user whose emoji or reaction emoji was removed   */

const emojiIDs = ['562330233315917843', '562330227322388485', '586161821338042379', '586161821551951882', '586161821044441088'];
module.exports = {
    execute(client, reaction, user) {
        if (user.bot) return;
        if (!emojiIDs.includes(reaction.emoji.id)) return;
        if (client.botRemovedReacts.get(user.id) === reaction.emoji.id) return client.botRemovedReacts.delete(user.id);
        if (!reaction.message.guild) return;
        if (user.id == reaction.message.author.id) return;
        console.log('messageReactionRemove');
        client.checkForRateLimit(reaction, user.id);

        client.handleReactUpdate(user, reaction, false);
    }
};