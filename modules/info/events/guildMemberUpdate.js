// guildMemberUpdate
/* Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the update
newMember    GuildMember        The member after the update    */

module.exports = {
    async execute(client, oldMember, newMember) {
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_UPDATE'}).then(audit => audit.entries.first());

        var oldMemberRoleNames = []
        var newMemberRoleNames = []

        oldMember.roles.forEach(r => {
            oldMemberRoleNames.push(r.name)
        });
        newMember.roles.forEach(r => {
            newMemberRoleNames.push(r.name)
        });

        var arr = [];
        if(oldMember.roles != newMember.roles) {
            if(client.scripts.containsAllElements(Array.from(oldMemberRoleNames), Array.from(newMemberRoleNames), false)) {
                arr.push(`Was removed from the ${client.scripts.endListWithAnd(client.scripts.containsAllElements(Array.from(newMemberRoleNames), Array.from(oldMemberRoleNames), true).map(r => `\`${r}\``))} role(s)`)
            } else {
                arr.push(`Received the ${client.scripts.endListWithAnd(client.scripts.containsAllElements(Array.from(oldMemberRoleNames), Array.from(newMemberRoleNames), true).map(r => `\`${r}\``))} role(s)`)
            };
        };
        if(oldMember.user.username != newMember.user.username) {
            arr.push(`Changed their username, \`${oldMember.user.tag}\` => \`${newMember.user.tag}\``);
            client.lastSeen(oldMember.user, `Changed their username`)
        };
        if(oldMember.nickname != newMember.nickname) {
            arr.push(`Changed their nickname, \`${oldMember.nickname}\` => \`${newMember.nickname}\``);
            client.lastSeen(oldMember.user, `Changed their nickname`)
        };
        if(newMember.user.avatarURL != oldMember.user.avatarURL) client.lastSeen(oldMember.user, `Changed their avatar`);

        client.createLogEntry(
            client,
            `${newMember.user.tag}`,
            `${newMember.toString()} has been updated`,
            arr,
            newMember.id, 
            client.constants.neonPink.hex,
            false
        );
    }
};