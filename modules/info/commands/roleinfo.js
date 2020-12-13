'use strict';

module.exports = {
   name: 'roleinfo',
   aliases: ['roleinformation', 'roleabout', 'aboutrole', 'role'],
   description: 'Displays a bunch of information about a specific Role',
   args: true,
   usage: '<role>',
   rateLimit: {
      usages: 4,
      duration: 30,
      maxUsers: 3
   },
   perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


   execute(client, args, message)
   {
      var role = client.getRole(client, args.join(" "), message.guild)
      if (!role) return message.reply("Couldn't find role.")

      let arr = message.guild.roles.array()
      arr.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

      for (let i = 0; i < arr.length; i++)
      {
         if (arr[i].id == role.id)
         {

            var createdPos = i + 1

            var RoleInfoEmbed = client.scripts.getEmbed()
               .setAuthor(`Role Information`, message.guild.iconURL.replace(/jpg$/g, "gif"), message.guild.iconURL.replace(/jpg$/g, "gif"))
               .setTitle(role.name)
               .setThumbnail(message.guild.iconURL.replace(/jpg$/g, "gif"))
               .setColor(role.color)
               .setDescription(`Users in Role: \`${role.members.size}\`\nCreationPos: \`${createdPos}\`\nBot Role: \`${role.managed}\`\nMentionable: \`${role.mentionable}\`\nCreated \`${client.time(new Date() - role.createdTimestamp)}\` ago\nPosition: \`${role.calculatedPosition}\`\nPermissions: \`${role.permissions}\``)
               .setFooter(role.id)
               .setTimestamp();

            message.channel.send({ embed: RoleInfoEmbed })
         }
      }
   }
}