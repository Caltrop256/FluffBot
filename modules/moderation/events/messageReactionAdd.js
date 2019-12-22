'use strict';
// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */



module.exports = {
    execute(client, reaction, user) {
        var guild = reaction.message.guild;
        if(!guild) return;
        var member = guild.member(user);

        if(reaction.emoji.name == "‼" || reaction.emoji.id == "619961652472840217") {
            reaction.remove(user);
            client.reportFunc(reaction.message,user,member);
        };
    }
};