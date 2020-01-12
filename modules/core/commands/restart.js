const Discord = require('discord.js');

const embedRed = 0xFC4B4B

module.exports = {
    name: 'restart',
    aliases: ['reboot'],
    description: 'Forcefully restarts the bot',
    args: false,
    usage: '',
    rateLimit: {
        usages: 5,
        duration: 120,
        maxUsers: 2
    },
    perms: ['DEV'],

    execute(client, args, message) {

        message.channel.send(new Discord.RichEmbed().setAuthor("Restarting...").setDescription("See you soon!").setFooter(new Date()).setColor(embedRed))
            .then(function (message) {
                message.react(":ralsleep:562354429093740544")
            }).then(msg => client.destroy())
        setTimeout(() => {
            console.log("--------------------\n[!] Restarting down TropBot (force restart) [!]")
            process.exit(0);
        }, 1000)

    }
}