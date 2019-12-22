// channelUpdate
/* Emitted whenever a channel is updated - e.g. name change, topic change.
PARAMETER        TYPE        DESCRIPTION
oldChannel       Channel     The channel before the update
newChannel       Channel     The channel after the update    */

module.exports = {
    async execute(client, oldChannel, newChannel) {
        if(!newChannel.guild) return;
        const entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());

        var arr = [];
        if(oldChannel.calculatedPosition != newChannel.calculatedPosition) arr.push(`Changed Position: \`${oldChannel.calculatedPosition}\` => \`${newChannel.calculatedPosition}\``);
        if(oldChannel.name != newChannel.name) arr.push(`Changed name: \`${oldChannel.name}\` => \`${newChannel.name}\``);
        if(oldChannel.nsfw != newChannel.nsfw) arr.push(`Changed NSFW warning: \`${oldChannel.nsfw}\` => \`${newChannel.nsfw}\``);
        if(oldChannel.parent.id != newChannel.parent.id) arr.push(`Changed category: \`${oldChannel.parent.name}\` => \`${newChannel.parent.name}\``);
        if(oldChannel.topic != newChannel.topic) arr.push(`Changed topic: \`${oldChannel.topic}\` => \`${newChannel.topic}\``);
        if(oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) arr.push(`Changed slowmode: \`${oldChannel.rateLimitPerUser}s\` => \`${newChannel.rateLimitPerUser}s\``)

        client.lastSeen(entry.executor, `Updated the #${newChannel.name} channel`)
        
        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} updated the ${newChannel.toString()} channel`,
            arr,
            newChannel.id, 
            client.constants.neonPink.hex,
            false
        );
    }
};