const Discord = require('discord.js');
const owofy = require('owofy');


const embedNeon_Pink = 0xFF0093


module.exports = {
    name: 'owofy',
    aliases: ['uwufy'],
    description: 'OwOfies the input',
    args: false,
    usage: '<message>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 60,
        maxUsers: 7
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {
        if(arguments.length) {
            let uwu = owofy(receivedMessage.content.slice(client.cfg.prefix.length + 6, receivedMessage.content.length));
            let uwuName = owofy(receivedMessage.member.displayName)

            var UwUEmbed = new Discord.RichEmbed()
                    .setColor(embedNeon_Pink)
                    .setAuthor(owofy(uwuName), receivedMessage.member.user.avatarURL)
                    .setDescription(uwu)
                    .setFooter(owofy("!"))
                    
                    
            receivedMessage.channel.send(UwUEmbed);
            receivedMessage.delete(100)
        }
        if(!arguments.length) {
            receivedMessage.channel.fetchMessages({ limit: 20 }).then(messages => {
                
                let filteredMessage = messages.filter(msg => !msg.content.toLowerCase().includes("uwufy")).filter(msg => !msg.author.bot).filter(msg => !msg.content.toLowerCase().includes("owofy"))
                var firstMessage = filteredMessage.first()

                if(!firstMessage) {return receivedMessage.reply("I could not locate any human activity")}

                let uwu = owofy(firstMessage.content)
                let uwuName = owofy(firstMessage.member.displayName)

                var UwUEmbed = new Discord.RichEmbed()
                    .setColor(embedNeon_Pink)
                    .setAuthor(owofy(uwuName), firstMessage.member.user.avatarURL)
                    .setDescription(uwu)
                    .setFooter(owofy("!" + ` - requested by ${receivedMessage.member.displayName}`), receivedMessage.member.user.avatarURL)
                    
                    
                receivedMessage.channel.send(UwUEmbed);
                receivedMessage.delete(100)

            })
        }

   }
}