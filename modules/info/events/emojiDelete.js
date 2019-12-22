// emojiDelete
/* Emitted whenever a custom guild emoji is deleted.
PARAMETER    TYPE         DESCRIPTION
emoji        Emoji        The emoji that was deleted    */

module.exports = {
    async execute(client, emoji) {
        const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first());

        client.lastSeen(entry.executor, `Deleted the :${emoji.name}: emoji)`);
        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} deleted the :${emoji.name}: emoji`,
            null,
            entry.executor.id, 
            client.constants.brightOrange.hex,
            false
        );
    }
};