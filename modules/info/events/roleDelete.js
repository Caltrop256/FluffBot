// roleDelete
/* Emitted whenever a guild role is deleted.
PARAMETER    TYPE        DESCRIPTION
role         Role        The role that was deleted    */



module.exports = {
    async execute(client, role) {
        const entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());

        client.lastSeen(entry.executor, `Deleted the ${role.name} role`)

        var arr = [];

        arr.push(`The role was created \`${client.time(Date.now() - role.createdTimestamp)}\` ago`)

        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} deleted the ${role.name} role`,
            arr,
            entry.executor.id, 
            client.constants.brightOrange.hex,
            true
        );
    }
}