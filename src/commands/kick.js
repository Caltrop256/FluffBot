const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');

const embedRed = 0xFC4B4B



module.exports = {
    name: 'kick',
    aliases: ['yeet'],
    description: 'Kicks a selected user from the Guild',
    args: true,
    usage: '<@user> <reason>',
    guildOnly: true,
    rateLimit: {
        usages: 5,
        duration: 60,
        maxUsers: 3
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
        let kickUser = client.getMemberFromArg(receivedMessage, arguments)
        if(!kickUser) return receivedMessage.reply("Couldn't find specified user");

        let reason = arguments.join(" ").slice(client.cfg.prefix.length + 20);

        const logs = client.channels.get("562338340918001684")

        let kickEmbed = new Discord.RichEmbed()
        .setDescription("User Kick")
        .setAuthor("Event: #" )
        .setColor(embedRed)
        .addField("Guild", receivedMessage.guild.toString())
        .addField("Moderator", receivedMessage.author)
        .addField("Kicked User", `<@${kickUser.id}>`)
        .addField("Kicked In", receivedMessage.channel)
        .addField("Reason", reason)
        .setTimestamp();

          
        
    
     
        

        logs.send({embed: kickEmbed})

        let kickUserEmbed = new Discord.RichEmbed()
        .setDescription("Cause: kicked by a moderator.")
        .setAuthor("You have been removed from " + receivedMessage.guild.toString())
        .setColor(embedRed)
        .addField("Guild", receivedMessage.guild.toString())
        .addField("Moderator", receivedMessage.author)
        .addField("Kicked User", `<@${kickUser.id}>`)
        .addField("Kicked In", receivedMessage.channel)
        .addField("Reason", reason)
        .setTimestamp();

        kickUser.send({embed: kickUserEmbed})
        setTimeout(() => {
            kickUser.kick()
          }, 1000);
    }
};
