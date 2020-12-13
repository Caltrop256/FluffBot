// channelCreate
/* Emitted whenever a channel is created.
PARAMETER    TYPE        DESCRIPTION
channel      Channel     The channel that was created    */

module.exports = {
    async execute(client, channel)
    {
        if (!channel.guild) return;
        const entry = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' }).then(audit => audit.entries.first());

        client.lastSeen(entry.executor, 'Created a channel');
        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} created a new channel ${entry.target.toString()}`,
            [`Accessible by ${channel.members.size} members`, `part of the ${channel.parent.name} category`],
            channel.id,
            client.constants.blue.hex,
            true
        );
    }
};