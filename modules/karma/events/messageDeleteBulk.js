// messageDeleteBulk
/* Emitted whenever messages are deleted in bulk.
PARAMETER    TYPE                              DESCRIPTION
messages     Collection<Snowflake, Message>    The deleted messages, mapped by their ID    */

module.exports = {
    async execute(client, messages)
    {
        for (var [ID, msg] of messages)
        {
            if (!msg.guild) return;
            console.log('messageDeleteBulk');
            client.handleReactRemoveAll(msg);
        }
    }
}