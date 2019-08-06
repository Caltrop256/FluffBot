const Discord = require('discord.js');

module.exports = {
    name: 'atsomeoneadmin',
    aliases: ['@someoneadmin'],
    description: 'Pings a random User',
    args: true,
    usage: '<message>',
    guildOnly: true,
    rateLimit: {
        usages: Infinity,
        duration: 1,
        maxUsers: Infinity
    },
    permLevel: 1, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {
    var memberArray = Array.from(receivedMessage.member.guild.members.filter(m => m.presence.status === 'idle' || m.presence.status === 'online'  && !m.user.bot ))
    var rand = memberArray[Math.floor(Math.random() * memberArray.length)];
    var user = memberArray[Math.floor(Math.random() * memberArray.length)];
    user = user.toString().split(",").pop();
    receivedMessage.channel.send( receivedMessage.author.toString() + " has pinged " + user.toString() + " !\n Message: `" + receivedMessage.content.slice(1, receivedMessage.content.length) + "`" + "\n\n use `" + client.cfg.prefix + "@someone <message>` to counter ping!")
    receivedMessage.delete(1000)
    }
};