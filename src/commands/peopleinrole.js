const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

module.exports = {
    name: 'peopleinrole',
    aliases: ['roleusers'],
    description: 'Displays all Users in a Role',
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


   async execute(client, arguments, receivedMessage) {
      var role = client.getRoleFromArg(receivedMessage, arguments, 0)
      if(!role) return receivedMessage.reply("Couldn't find role.")

      var leaderboardEmbed = new Discord.RichEmbed()
      .setAuthor(`All People with the ${role.name} role`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
      .setDescription(`Below you will find a list of all ${role.members.size} members with the ${role.toString()} role.`)
      .setColor(0x74B979)
      
      var LeaderBoard = ''

      function numComma(x) {
          var parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
      }  

      await role.members.forEach(m => {
          var rowMember = receivedMessage.guild.members.get(m.id)
          LeaderBoard += `${rowMember.toString()}\n`
      })

      var LeaderboardArray = LeaderBoard.split('\n')

      LeaderboardArray.length = LeaderboardArray.length - 1
      var Itteration = 0

      while (LeaderboardArray.length > 0) {
         Itteration++
         chunk = LeaderboardArray.splice(0, 5)
         leaderboardEmbed.addField("󠀡", chunk)
      }


      receivedMessage.channel.send({embed: leaderboardEmbed})
   }
}