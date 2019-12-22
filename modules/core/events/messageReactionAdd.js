'use strict';

// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */

module.exports = {
    async execute(client, reaction, user) {
        let message_id = client.cfg.ruleAccept;
        if(reaction.message.id !== message_id)return;
        reaction.remove();
        var member = reaction.message.guild.member(user);
        let role = (member.guild.roles.find(role => role.name === "Welcome")) 
        member.removeRole(role)
        .then(() => 
        {
            console.log(`Removed role ${role} from ${member.displayName}`);
        });
    }
}