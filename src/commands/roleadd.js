const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

module.exports = {
    name: 'roleadd',
    aliases: ['addrole'],
    description: 'Adds a user to a Role',
    args: true,
    usage: '<user> <role>',
    guildOnly: true,
    rateLimit: {
      usages: 5,
      duration: 5,
      maxUsers: 10
   },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
      var user = client.getMemberFromArg(receivedMessage, arguments, 0)
      if(!user) return receivedMessage.reply("Couldn't find User.")
      var role = client.getRoleFromArg(receivedMessage, arguments, 1)
      if(!role) return receivedMessage.reply("Couldn't find role.")

      if(user.roles.has(role.id)) return receivedMessage.reply(`\`${user.displayName}\` already has the \`${role.name}\` role.`)
      user.addRole(role.id, `Command by ${receivedMessage.author.username}`)
      var rolegiven = new Discord.RichEmbed()
         .setAuthor(`Gave ${user.displayName} a Role`, user.user.avatarURL, user.user.avatarURL)
         .setDescription(`${user} has received the ${role.toString()} role.`)
         .setColor(role.color)
         .setTimestamp();
      receivedMessage.channel.send({embed: rolegiven})
   }
}