const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

module.exports = {
    name: 'rolementionable',
    aliases: ['mentionable'],
    description: 'Toggles if a Role can be mentioned or not',
    args: true,
    usage: '<role>',
    guildOnly: true,
    rateLimit: {
      usages: 5,
      duration: 1,
      maxUsers: 10
   },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
       var role = client.getRoleFromArg(receivedMessage, arguments, 0)
       if(!role) return receivedMessage.reply("Couldn't find role.")

      if(role.mentionable == false) {
         role.setMentionable(true, `Command by ${receivedMessage.author.username}`)
         var enabledEmbed = new Discord.RichEmbed()
         .setAuthor(`Mentioning enabled`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
         .setDescription(`${role.toString()} can now be mentioned`)
         .setColor(role.color)
         .setTimestamp();
         return receivedMessage.channel.send({embed: enabledEmbed})
      }
      if(role.mentionable == true) {
         role.setMentionable(false, `Command by ${receivedMessage.author.username}`)
         var DisabledEmbed = new Discord.RichEmbed()
         .setAuthor(`Mentioning disabled`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
         .setDescription(`${role.toString()} can no longer be mentioned`)
         .setColor(role.color)
         .setTimestamp();
         return receivedMessage.channel.send({embed: DisabledEmbed})
      }
   }
}