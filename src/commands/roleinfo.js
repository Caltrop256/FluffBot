const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

module.exports = {
    name: 'roleinfo',
    aliases: ['roleinformation', 'roleabout', 'aboutrole', 'role'],
    description: 'Displays a bunch of information about a specific Role',
    args: true,
    usage: '<role>',
    guildOnly: true,
    rateLimit: {
      usages: 4,
      duration: 30,
      maxUsers: 3
   },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
       var role = client.getRoleFromArg(receivedMessage, arguments, 0)
       if(!role) return receivedMessage.reply("Couldn't find role.")

       let arr = receivedMessage.guild.roles.array()
       arr.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

       for (let i = 0; i < arr.length; i++) { 
         if (arr[i].id == role.id) {

            var createdPos = i + 1

            var RoleInfoEmbed = new Discord.RichEmbed()
            .setAuthor(`Role Information`, receivedMessage.guild.iconURL.replace(/jpg$/g, "gif"), receivedMessage.guild.iconURL.replace(/jpg$/g, "gif"))
            .setTitle(role.name)
            .setThumbnail(receivedMessage.guild.iconURL.replace(/jpg$/g, "gif"))
            .setColor(role.color)
            .setDescription(`Users in Role: \`${role.members.size}\`\nCreationPos: \`${createdPos}\`\nBot Role: \`${role.managed}\`\nMentionable: \`${role.mentionable}\`\nCreated \`${prettyMs(new Date() - role.createdTimestamp, {verbose: true, compact: true})}\` ago\nPosition: \`${role.calculatedPosition}\`\nPermissions: \`${role.permissions}\``)
            .setFooter(role.id)
            .setTimestamp();

            receivedMessage.channel.send({embed: RoleInfoEmbed})
         }
        }
   }
}