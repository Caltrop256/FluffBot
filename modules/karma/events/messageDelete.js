// messageDelete
/* Emitted whenever a message is deleted.
PARAMETER      TYPE           DESCRIPTION
message        Message        The deleted message    */

module.exports = {
    async execute(client, message)
    {
        if (!message.guild) return;
        console.log('messageDelete');
        client.handleReactRemoveAll(message);
    }
}