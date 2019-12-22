// messageDeleteBulk
/* Emitted whenever messages are deleted in bulk.
PARAMETER    TYPE                              DESCRIPTION
messages     Collection<Snowflake, Message>    The deleted messages, mapped by their ID    */

module.exports = {
    async execute(client, messages) {
        var channel = messages.first().channel;
        var users = client.scripts.getCollection();
        var arr = [];

        messages.forEach(m => {
            var u = users.get(m.author.id);
            if(u) {
                users.set(m.author.id, {u: m.author, count: u.count + 1})
            } else {
                users.set(m.author.id, {u: m.author, count: 1})
            };
        });

        users.forEach(u => {
            arr.push(`${u.u.toString()}: \`${u.count}\` message${u.count == 1 ? '' : 's'}`);
        });

        client.createLogEntry(
            client,
            `#${channel.name}`,
            `Bulk deleted ${messages.size} messages in ${channel.toString()}`,
            arr,
            channel.id, 
            client.constants.red.hex,
            true
        );
    }
};