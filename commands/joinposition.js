const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const translate = require('google-translate-api');
const prettyMs = require('pretty-ms');

const embedPerfect_Orange = 0xFF7D00 
const embedGreen = 0x74B979

module.exports = {
    name: 'joinposition',
    aliases: ['joinpos'],
    description: 'Outputs the Join Position of a User',
    args: false,
    usage: '<UserID>',
    guildOnly: false,
    rateLimit: {
      usages: 3,
      duration: 20,
      maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage, primaryCommand) {

        if(arguments[0]) {
          //var JoinPosMember = receivedMessage.guild.member(receivedMessage.mentions.users.first()||receivedMessage.guild.members.get(arguments[0])||receivedMessage.guild.members.find(member => member.user.username.toLowerCase() == arguments[0].toLowerCase())||receivedMessage.guild.members.find(member => member.displayName.toLowerCase() == arguments[0].toLowerCase())||receivedMessage.guild.members.find(member => `${member.user.username.toLowerCase()}#${member.user.discriminator}`.toLowerCase() == arguments[0].toLowerCase()))
          var JoinPosMember = client.getMemberFromArg(receivedMessage, arguments, "all")
          if(!JoinPosMember) {return receivedMessage.reply("Couldn't find specified user.")}
        } else { var JoinPosMember = receivedMessage.member}
        console.log(JoinPosMember.displayName)

        let arr = receivedMessage.guild.members.array().filter(m => !m.user.bot); 
            arr.sort((a, b) => a.joinedAt - b.joinedAt);

            for (let i = 0; i < arr.length; i++) { 
              if (arr[i].id == JoinPosMember.id) {
                var joinPos = i
                receivedMessage.guild.fetchMember(arr[i].id).then(JoinPosMember => {
                    var joinPosEmbed = new Discord.RichEmbed()
                    .setAuthor(JoinPosMember.user.username, JoinPosMember.user.avatarURL, JoinPosMember.user.avatarURL)
                    .setDescription(`Join Position: \`${joinPos + 1}\`\nJoined: \`${prettyMs(new Date() - JoinPosMember.joinedTimestamp, {verbose: true, compact: true})}\` ago`) 
                    .setColor(embedGreen)
                    .setFooter(`Requested by ${receivedMessage.author.username}`)

                    receivedMessage.channel.send({embed: joinPosEmbed})

                })
              }; 
            }
    }
}