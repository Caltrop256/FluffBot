const Discord = require('discord.js');

const embedRed = 0xFC4B4B

module.exports = {
    name: 'shutdown',
    aliases: ['shut'],
    description: 'Forcefully shuts down the bot',
    args: false,
    usage: '',
    rateLimit: {
        usages: 5,
        duration: 120,
        maxUsers: 2
    },
    perms: ['DEV'],

    execute(client, args, message) {

        message.channel.send('Shutting down...')
            .then(function (message) {
                message.react(":ralsleep:562354429093740544")
            }).then(msg => client.destroy())
        setTimeout(() => {
            console.log("--------------------\n[!] Shutting down TropBot (force shutdown) [!]")
            process.exit(1)
        }, 1000)

    }
}