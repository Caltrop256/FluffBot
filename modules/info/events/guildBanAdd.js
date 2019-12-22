// guildBanAdd
/* Emitted whenever a member is banned from a guild.
PARAMETER    TYPE          DESCRIPTION
guild        Guild         The guild that the ban occurred in
user         User          The user that was banned    */

module.exports = {
    async execute(client, guild, user) {
        const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
        
        client.lastSeen(entry.executor, `Banned ${user.tag}`);
        client.lastSeen(user, `Was banned by ${entry.executor.tag}`);
        
        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} banned ${user.toString()} from ${guild.name}`,
            null,
            entry.executor.id, 
            client.constants.redder.hex,
            true
        );
    }
};