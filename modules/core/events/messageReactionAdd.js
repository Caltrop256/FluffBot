'use strict';

// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */

module.exports = {
    async execute(client, reaction, user)
    {
        let message_id = client.cfg.ruleAccept;
        if (reaction.message.id !== message_id) return;
        reaction.remove();
        var member = reaction.message.guild.member(user);

        if (client.scripts.isSuspect(user, client) && member.joinedTimestamp > Date.now() - 600000)
        {
            let embed = client.scripts.getEmbed()
                .setAuthor(`Please wait ${client.time(member.joinedTimestamp - (Date.now() - 600000))}`)
                .setColor(client.constants.red.hex)
                .setTimestamp();
            return user.send({
                embed
            });
        } else
        {
            let role = (member.guild.roles.find(role => role.name === "Welcome"))
            member.removeRole(role)
                .then(() =>
                {
                    console.log(`Removed role ${role} from ${member.displayName}`);
                    member.addRole(member.guild.roles.get("658298114184052739"));
                    setTimeout(() =>
                    {
                        member.removeRole(member.guild.roles.get("658298114184052739"));
                    }, (client.scripts.isSuspect(user, client) ? 600000 * 3 : 600000))
                });
        }
    }
}