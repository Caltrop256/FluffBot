//'use strict';

// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */

const emojiIDs = ['562330233315917843', '562330227322388485', '586161821338042379', '586161821551951882', '586161821044441088'];
module.exports = {
    execute(client, reaction, user) {
        if (user.bot) return;
        if (!reaction.message.guild) return;
        if (!emojiIDs.includes(reaction.emoji.id)) return;
        if (user.id == reaction.message.author.id) return reaction.remove(user.id);
        console.log('messageReactionAdd');
        if (client.checkForRateLimit(reaction, user.id))
            return client.removeReact(reaction, user.id);

        client.handleAwards(reaction, user).then(result => {
            if (result === false) return client.removeReact(reaction, user.id);
            client.handleReactUpdate(user, reaction, true);

        })

    }
};