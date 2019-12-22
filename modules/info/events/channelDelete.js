// channelDelete
/* Emitted whenever a channel is deleted.
PARAMETER   TYPE      DESCRIPTION
channel     Channel   The channel that was deleted    */



module.exports = {
    async execute(client, channel) {
        if(!channel.guild) return;
        const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());

        client.lastSeen(entry.executor, 'Deleted a channel');
        client.createLogEntry(
            client, 
            `${entry.executor.tag}`, 
            `${entry.executor.toString()} deleted the #${channel.name} channel`, 
            [`Used to be accessible by ${channel.members.size} members`, 
            `was in the ${channel.parent.name} category`], 
            channel.id, 
            client.constants.brightOrange.hex,
            true
        );
    }
};