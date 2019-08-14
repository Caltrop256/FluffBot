const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');

module.exports = {
    name: 'oldmute',
    aliases: ['omute', 'shortmute'],
    description: 'Mutes the selected user for a specific amount of time',
    args: true,
    usage: '<@user> <Mute time>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
    let mutemember = client.getMemberFromArg(receivedMessage, arguments)
    if(!mutemember) return receivedMessage.reply("You haven't specified a User.")
    let muteRole = receivedMessage.guild.roles.get("562364319761956875")
    if(!muteRole) return receivedMessage.reply("Mute Role not found.")
    let params = receivedMessage.content.split(" ").slice(1);
    let time = params[1];
    if(!time) return receivedMessage.reply("No time arguments received.")

    if(time < 3000 ) return receivedMessage.reply("Mutes be at least 3 seconds long.")

    if(time > 473354280000 ) return receivedMessage.reply("Mutes must be shorter than 15 years.")

    mutemember.addRole(muteRole.id, `Muted by ${receivedMessage.member.displayName}`)
    receivedMessage.channel.send(mutemember.user.tag + " has been muted for " + ms(ms(time), {long: true}))

    setTimeout(function() {
        mutemember.removeRole(muteRole.id, `Unmuted: originally muted by ${receivedMessage.member.displayName}`);
        receivedMessage.channel.send(mutemember.user.tag + " has been unmuted, the mute lasted " + ms(ms(time), {long: true}))
    }, ms(time));
    }
};

