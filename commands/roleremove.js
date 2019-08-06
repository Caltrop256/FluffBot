const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

module.exports = {
    name: 'roleremove',
    aliases: ['removerole'],
    description: 'Removes a user from a Role',
    args: true,
    usage: '<user> <role>',
    guildOnly: true,
    rateLimit: {
      usages: 2,
      duration: 20,
      maxUsers: 10
  },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
      var user = client.getMemberFromArg(receivedMessage, arguments, 0)
      if(!user) return receivedMessage.reply("Couldn't find User.")
      var role = client.getRoleFromArg(receivedMessage, arguments, 1)
      if(!role) return receivedMessage.reply("Couldn't find role.")

      if(!user.roles.has(role.id)) return receivedMessage.reply(`\`${user.displayName}\` doesn't have the \`${role.name}\` role.`)
      user.removeRole(role.id, `Command by ${receivedMessage.author.username}`)
      var rolegiven = new Discord.RichEmbed()
      .setAuthor(`Removed ${user.displayName} from a Role`, user.user.avatarURL, user.user.avatarURL)
      .setDescription(`${user} was removed from the ${role.toString()} role.`)
      .setColor(role.color)
      .setTimestamp();
      receivedMessage.channel.send({embed: rolegiven})
   }
}