const Discord = require('discord.js');
const fs = require('fs');


const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'reload',
    aliases: ['reloadcmds', 'rcmds'],
    description: 'Reloads a command file',
    args: true,
    usage: '<name of command> | <all>',
    guildOnly: false,
    rateLimit: {
        usages: 3,
        duration: 60,
        maxUsers: 3
    },
    permLevel: 3, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: false,

execute(client, arguments, receivedMessage) {

        if(arguments[0].toLowerCase() !== "all") {
            const command = fs.readdirSync('./commands').filter(file => file == `${arguments[0]}.js`);
            if(!command[0]) return receivedMessage.reply(`Command \`${arguments[0]}\` not found.`)
            const commandfile = require(`./${command[0]}`);
            client.commands.delete(commandfile.name)
            client.commands.set(commandfile.name, commandfile);
        }
    }
}