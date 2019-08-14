const Discord = require('discord.js');

module.exports = {
    name: 'module',
    aliases: ['m'],
    description: 'Used to Enable, Disable or Reload Certain Modules',
    args: true,
    usage: 'reload|enable|disable <name>|(event|command <name>)',
    guildOnly: false,
    rateLimit: {
        usages: Infinity,
        duration: 0,
        maxUsers: 1
    },
    permLevel: 5, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {
    receivedMessage.channel.send("uwu");
   }
}

