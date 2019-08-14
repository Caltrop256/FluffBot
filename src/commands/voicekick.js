const Discord = require('discord.js');
const config = require("./json/config.json");
const fs = require('fs');
const ms = require('ms');

const embedRed = 0xFC4B4B


module.exports = {
    name: 'voicekick',
    aliases: ['vckick', 'vkick'],
    description: 'Kicks a selected user from the voice channel',
    args: true,
    usage: '<@user>',
    guildOnly: true,
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
    let kickUser = client.getMemberFromArg(receivedMessage, arguments)
    if(!kickUser) return receivedMessage.reply("Couldn't find specified user");
    kickUser.setVoiceChannel(null)
    }
};
