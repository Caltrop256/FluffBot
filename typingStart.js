// typingStart
/* Emitted whenever a user starts typing in a channel.
PARAMETER      TYPE            DESCRIPTION
channel        Channel         The channel the user started typing in
user           User            The user that started typing    */

const Discord = require('discord.js');
const config = require("../commands/json/config.json");

module.exports = (client, channel, user) => {

    if(channel.guild) {
        channel.guild.fetchMember(user)
        .then((addedByMember) => 
        { client.lastSeen(addedByMember, `Started typing in #${channel.name}`)
        })
    }
}