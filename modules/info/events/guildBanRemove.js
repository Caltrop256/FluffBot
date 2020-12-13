// guildBanRemove
/* Emitted whenever a member is unbanned from a guild.
PARAMETER    TYPE         DESCRIPTION
guild        Guild        The guild that the unban occurred in
user         User         The user that was unbanned    */

module.exports = {
    async execute(client, guild, user)
    {
        const entry = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' }).then(audit => audit.entries.first());

        client.lastSeen(entry.executor, `Unbanned ${user.tag}`);
        client.lastSeen(user, `Was unbanned by ${entry.executor.tag}`);

        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} unbanned ${user.toString()} from ${guild.name}`,
            null,
            entry.executor.id,
            client.constants.neonGreen.hex,
            true
        );
    }
};