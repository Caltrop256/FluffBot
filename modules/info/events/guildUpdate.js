// guildUpdate
/* Emitted whenever a guild is updated - e.g. name change.
PARAMETER     TYPE      DESCRIPTION
oldGuild      Guild     The guild before the update
newGuild      Guild     The guild after the update    */

module.exports = {
    async execute(client, oldGuild, newGuild) {
        const entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());

        client.lastSeen(entry.executor, `Updated this Guild`)

        var arr = [...entry.changes];
        
        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} updated this Guild`,
            arr,
            entry.executor.id, 
            client.constants.neonPink.hex,
            true
        );
    }
}