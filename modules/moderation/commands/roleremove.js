'use strict';

module.exports = {
  name: 'roleremove',
  aliases: ['removerole'],
  description: 'Removes a user from a Role',
  args: true,
  usage: '<user> <role>',
  rateLimit: {
    usages: 2,
    duration: 20,
    maxUsers: 10
  },
  perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_ROLES'],

  execute(client, args, message) {
    var user = client.getMember(args[0], message.guild, null);
    if (!user) return message.reply("Couldn't find User.")
    var role = client.getRole(client, args[1], message.guild)
    if (!role) return message.reply("Couldn't find role.")

    if (!user.roles.has(role.id)) return message.reply(`\`${user.displayName}\` doesn't have the \`${role.name}\` role.`)
    user.removeRole(role.id, `Command by ${message.author.username}`)
    var rolegiven = client.scripts.getEmbed()
      .setAuthor(`Removed ${user.displayName} from a Role`, user.user.avatarURL, user.user.avatarURL)
      .setDescription(`${user} was removed from the ${role.toString()} role.`)
      .setColor(role.color)
      .setTimestamp();
    message.channel.send({ embed: rolegiven });
  }
};