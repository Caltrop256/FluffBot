const Discord = require('discord.js');
const config = require("./json/config.json");
const prettyMs = require('pretty-ms');

const embedNeon_Pink = 0xFF0093
module.exports = {
    name: 'status',
    aliases: ['uptime'],
    description: 'Displays the Bot\'s status',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 30,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {

    var lr = new Date(client.readyTimestamp)

    let status = new Discord.RichEmbed()
    .setAuthor(`Bot Status`, client.user.avatarURL)
    .setDescription(`Uptime: \`${prettyMs(client.uptime, {verbose: false, compact: false}).replace(/.\d+s/, "s")}\`\nPing: \`${Math.floor(client.ping)}ms\`\nAllocated Memory: \`${Math.floor(process.memoryUsage().rss / 1024 / 1024)}mb\`\nHeap: \`${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024)}mb\` / \`${Math.ceil(process.memoryUsage().heapTotal / 1024 / 1024)}mb\``)
    .setColor(embedNeon_Pink)
    .setFooter(`Latest restart: ${lr.getUTCHours()}:${lr.getUTCMinutes()}:${lr.getUTCSeconds()} - ${lr.getUTCDate()}/${lr.getUTCMonth()+1}/${lr.getUTCFullYear()}`)

    receivedMessage.channel.send({embed: status})
    }
};
