const Discord = require('discord.js');
const fs = require('fs');



module.exports = {
    name: 'fetchall',
    aliases: ['fetch'],
    description: 'fetches every instance of a specified object',
    args: true,
    usage: '<users|channels>',
    guildOnly: true,
    rateLimit: {
        usages: 0,
        duration: Infinity,
        maxUsers: 0
    },
    permLevel: 5, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: false,

    execute(client, arguments, receivedMessage) {

        if(arguments[0].toLowerCase() == "users") {
                global.global_AllUsers = receivedMessage.guild.fetchMembers().then(u => {
                u.members.array().forEach(u => {
                    let username = `${u.user.username}#${u.user.discriminator}`;
                    console.log(`${username}`);
                });
                });
            }

    }
}