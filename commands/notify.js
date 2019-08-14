const Discord = require('discord.js');
const fs = require('fs');
var fileName = './subscriptions.json';
module.exports = {
    name: 'notify',
    aliases: ['notif'],
    description: 'Subscribe/Unsubscribe to be DMed on certain updates',
    args: true,
    usage: 'notify avatar',
    guildOnly: false,
    rateLimit: {
        usages: Infinity,
        duration: 0,
        maxUsers: Infinity
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
    async execute(client, arguments, receivedMessage) {
        
        if(arguments[0].toLowerCase() == 'avatar')
        {
            var UserID = receivedMessage.author.id;
            var indexOf = client.subscriptions.avatar.indexOf(UserID);
            if(indexOf !== -1)
            {
                client.subscriptions.avatar = client.subscriptions.avatar.filter((userID) => client.subscriptions.avatar.indexOf(userID) != indexOf);
                receivedMessage.reply('Unsubscribed from avatar notifications');
            }
            else
            {
                try
                {
                await receivedMessage.author.send('Just testing to make sure Direct Messaging is enabled');
                client.subscriptions.avatar.push(UserID)
                receivedMessage.reply('Subscribed to avatar notifications');
                }
                catch
                {
                    return receivedMessage.reply('I am not able to send you Direct Messages, please check your server privacy settings and make sure \'Allow direct messages from server members.\' is enabled');
                }
            }
            
            fs.writeFile(fileName,JSON.stringify(client.subscriptions), function (err) {
                if (err) return console.log(err);
                console.log(client.subscriptions);
              });
        }
        else
        {
            receivedMessage.reply('Invalid option!');
        }
         //receivedMessage.channel.send("test twuwu");
        
   }
}

