// emojiCreate
/* Emitted whenever a custom emoji is created in a guild.
PARAMETER    TYPE          DESCRIPTION
emoji        Emoji         The emoji that was created    */

module.exports = {
    async execute(client, emoji) {
        const entry = await emoji.guild.fetchAuditLogs({ type: 'EMOJI_CREATE' }).then(audit => audit.entries.first());

        client.lastSeen(entry.executor, `Created the :${emoji.name}: emoji`)

        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} created the :${emoji.name}: emoji`,
            [emoji.toString()],
            entry.executor.id,
            client.constants.blue.hex,
            false
        );
    }
}