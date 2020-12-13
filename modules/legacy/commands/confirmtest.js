module.exports = {
    name: 'confirmtest',
    aliases: ['confirm', 'contest'],
    description: 'Test confirm thing aaaa',
    args: false,
    usage: 'asdf',
    rateLimit: {
        usages: 0,
        duration: 0,
        maxUsers: 0
    },
    perms: ['DEV'],

    execute(client, args, message)
    {
        client.createConfirmation(message, {
            title: 'you sure?',
            description: 'you boutta h, that aight?',
            timeout: client.time(2000), // can be Number|String|client.time
            color: client.constants.green, // can be Number|String|client.constants.Color
            deleteMessage: true
        }).then((hasConfirmed) =>
        {
            if (hasConfirmed)
                message.reply("selected true");
            else
                message.reply("selected false");
        }).catch((err) =>
        {
            if (err)
            {
                message.reply("error");
                console.log(err);
            }
            else
                message.reply("timed out");
        }).finally(() =>
        {
            message.reply("after result");
        });

    }
}

