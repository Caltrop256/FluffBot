// guildMemberAdd
/* Emitted whenever a user joins a guild.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that has joined a guild    */

module.exports = {
    execute(client, member) {
        client.lastSeen(member, `Joined the Guild`)
        member.guild.fetchInvites().then(guildInvites => {
            const ei = client.invites[member.guild.id];
            client.invites[member.guild.id] = guildInvites;
            const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
            if (invite) var inviter = client.users.get(invite.inviter.id);


        });
    }
};