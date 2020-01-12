// roleCreate
/* Emitted whenever a role is created.
PARAMETER    TYPE        DESCRIPTION
role         Role        The role that was created    */

module.exports = {
    async execute(client, role) {
        const entry = await role.guild.fetchAuditLogs({ type: 'ROLE_CREATE' }).then(audit => audit.entries.first());

        client.lastSeen(entry.executor, `Created the ${role.name} role`)

        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} created the ${role.toString()} role`,
            null,
            entry.executor.id,
            client.constants.blue.hex,
            true
        );
    }
}