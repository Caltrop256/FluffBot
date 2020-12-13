'use strict';
const repl = require("repl");
module.exports = {
    name: 'repl',
    aliases: [],
    description: 'Toggle REPL mode',
    args: false,
    usage: '',
    rateLimit: {
        usages: 2,
        duration: 100,
        maxUsers: 1
    },
    perms: ['DEV'],

    execute(client, args, message)
    {
        if (!client.repl) client.repl = repl;
        if (client.replEnabled)
            return message.channel.send('REPL session already started.');
        client.replEnabled = true;
        client.replServer = repl.start({
            prompt: "TropBot>",
        });
        client.replServer.context.client = client;
        client.replServer.on('exit', () =>
        {
            client.replEnabled = false;
            message.channel.send('REPL session ended.');
        });
        message.channel.send('REPL session started.');
    }
}

