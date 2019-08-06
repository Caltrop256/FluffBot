const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');

const embedRed = 0xFC4B4B
const embedReder = 0xFF0000



module.exports = {
    name: 'ban',
    aliases: ['>:('],
    description: 'Bans a selected user from the Guild',
    args: true,
    usage: '<@user> <reason>',
    guildOnly: true,
    rateLimit: {
        usages: 3,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage, primaryCommand) {
    var banUser = client.getMemberFromArg(receivedMessage, arguments)
    if(!banUser) return receivedMessage.reply("Couldn't find specified user");

    let reason = arguments.join(" ").slice(client.cfg.prefix.length + arguments[0].length);
    if(!reason) reason = `No reason provided`

    const logs = client.channels.get("562338340918001684")

    let banEmbed = new Discord.RichEmbed()
        .setDescription("User Ban")
        .setAuthor("Event: #" )
        .setColor(embedReder)
        .addField("Guild", receivedMessage.guild.toString())
        .addField("Moderator", receivedMessage.author)
        .addField("Banned User", `<@${banUser.id}>`)
        .addField("Banned In", receivedMessage.channel)
        .addField("Reason", reason)
        .setTimestamp();

          
        
    
     
        

        logs.send({embed: banEmbed})

        let banUserEmbed = new Discord.RichEmbed()
        .setDescription("Cause: banned by a moderator.")
        .setAuthor("You have been removed from " + receivedMessage.guild.toString())
        .setThumbnail(receivedMessage.guild.iconURL)
        .setColor(embedReder)
        .addField("Guild", receivedMessage.guild.toString())
        .addField("Moderator", receivedMessage.author)
        .addField("Banned User", `<@${banUser.id}>`)
        .addField("Banned in", receivedMessage.channel)
        .addField("Reason", reason)
        .setTimestamp();

        setTimeout(() => {
            banUser.send({embed: banUserEmbed})
            .then(function () {
                banUser.ban({
                    reason: reason
                  });
            })
          }, 1000);
    }
};
