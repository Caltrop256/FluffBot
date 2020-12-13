const fs = require('fs');
var fileName = process.env.tropbot + '/subscriptions.json';
module.exports = {
    name: 'avatarnotify',
    aliases: ['anotif'],
    description: 'Subscribe/Unsubscribe to be DMed on avatar change',
    args: false,
    usage: '',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    async execute(client, args, message)
    {
        var userID = message.author.id;
        var indexOf = client.subscriptions.avatar.indexOf(userID);
        var toDelete = false;
        if (indexOf !== -1)
        {
            client.subscriptions.avatar = client.subscriptions.avatar.filter((userID) => client.subscriptions.avatar.indexOf(userID) != indexOf);
            toDelete = true;
            message.reply('Unsubscribed from avatar notifications');
        } else
        {
            try
            {
                await message.author.send('Just testing to make sure Direct Messaging is enabled');
                client.subscriptions.avatar.push(userID);
                message.reply('Subscribed to avatar notifications');
            } catch {
                return message.reply('I am unable to send you Direct Messages, please check your server privacy settings and make sure \'Allow direct messages from server members.\' is enabled');
            }
        }

        client.setSubscription('avatar', userID, toDelete).catch((err) => console.log(err));
    }
}