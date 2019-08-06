const Discord = require('discord.js');
const fs = require('fs');


module.exports = {
    name: 'atsomeone',
    aliases: ['@someone'],
    description: 'Pings a random User',
    args: true,
    usage: '<message>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 5
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: false,
   
   execute(client, arguments, receivedMessage) {
    receivedMessage.react("✅");
           client.user.setActivity('some Nerds ping each other', {type: "WATCHING"})
           var memberArray = Array.from(receivedMessage.member.guild.members.filter(m => m.presence.status === 'idle' || m.presence.status === 'online'  && !m.user.bot))
           var user = memberArray[Math.floor(Math.random() * memberArray.length)];
            user = user.toString().split(",").pop();

            let atSomeoneVictim = user

            var AuthorMessage = receivedMessage.content.toString().replace('`', '');
            //AuthorMessage = AuthorMessage.replaceAll('`', '');
            console.log(AuthorMessage)
            //receivedMessage.content.slice(2, receivedMessage.content.length).replace(/^`/i, '')

            receivedMessage.channel.send(receivedMessage.author.toString() + " has pinged " + user.toString() + "\nMessage: " + "`" + AuthorMessage.slice(client.cfg.prefix.length + 1, receivedMessage.content.length)  + "`" + "\n\nYou can use `" + client.cfg.prefix + "$@someone <message>` to counter ping!");
           receivedMessage.delete(100)

           

           const logs = client.channels.get("562338340918001684");
            var atsomeonelogEmbed = new Discord.RichEmbed()
            .setAuthor("Event: #" )
            .setTitle("@someone Command")
            .setDescription("\n**Guild:** `" + receivedMessage.guild.toString() + "`" + "\n**Author:** " + receivedMessage.author.toString() + "\n**Victim:** " + atSomeoneVictim + "\n**Channel:** " + receivedMessage.channel.toString() + "\n**Message Contents:** `" + AuthorMessage.slice(2, receivedMessage.content.length) + "`")
            .setColor(embedReder)
            .setTimestamp()
            .setURL("https://www.reddit.com/r/fluffyboi/wiki/discord_bot#wiki_tracking_events")
            .setTimestamp()

            logs.send({embed: atsomeonelogEmbed})
    }
};