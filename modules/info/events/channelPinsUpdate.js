// channelPinsUpdate
/* Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event, not much information can be provided easily here - you need to manually check the pins yourself.
PARAMETER    TYPE         DESCRIPTION
channel      Channel      The channel that the pins update occurred in
time         Date         The time of the pins update    */

module.exports = {
    async execute(client, channel, time)
    {

        client.createLogEntry(
            client,
            `#${channel.name}`,
            `Someone removed or added a Pin to ${channel.toString()}`,
            null,
            channel.id,
            client.constants.neonPink.hex,
            true
        );
    }
};