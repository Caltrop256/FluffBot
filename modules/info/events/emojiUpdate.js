// emojiUpdate
/* Emitted whenever a custom guild emoji is updated.
PARAMETER    TYPE       DESCRIPTION
oldEmoji     Emoji      The old emoji
newEmoji     Emoji      The new emoji    */

module.exports = {
    async execute(client, oldEmoji, newEmoji) {
        const entry = await newEmoji.guild.fetchAuditLogs({type: 'EMOJI_UPDATE'}).then(audit => audit.entries.first());

        var arr = [];
        arr.push(newEmoji.toString());
        if(oldEmoji.name != newEmoji.name) arr.push(`Changed name: \`:${oldEmoji.name}:\` => \`:${newEmoji.name}:\``)

        client.lastSeen(entry.executor, `Updated the :${newEmoji.name}: emoji`)
        
        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} updated the :${newEmoji.name}: emoji`,
            [arr],
            entry.executor.id, 
            client.constants.neonPink.hex,
            false
        );
    }
};