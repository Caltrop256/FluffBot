const Discord = require('discord.js');

const embedRed = 0xFC4B4B

module.exports = {
    name: 'forcerestart',
    aliases: ['restart', 'reboot'],
    description: 'Forcefully restarts the bot',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: 5,
        duration: 120,
        maxUsers: 2
    },
    permLevel: 3, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

        receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Restarting...").setDescription("See you soon!").setFooter(new Date()).setColor(embedRed))
        .then(function (message){
            message.react(":ralsleep:562354429093740544")
        }).then(msg => client.destroy ())
        setTimeout(() => {
            console.log("--------------------\n[!] Restarting down TropBot (forcerestart) [!]")
            process.exit(1)
        }, 1000)
        
    }
}