const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['pong', 'latency', 'lat', 'pings'],
    description: 'Displays the current Latency of the Bot',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 40,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {

        let pings = client.pings.map(function(e) {return "\`" + e + "ms\`"});
        let pingsJoined = pings.join(", ").replace(/, ([^,]*)$/, ' and $1')

        const embedNeon_Green = 0x1DFF2D
        var pingEmbed = new Discord.RichEmbed()
        .setTitle("Current Bot Latency")
        .setDescription("tropbot-main")
        .addField("Full-trip Latency", "calculating")
        .addField("Average Latency", Math.round(client.ping) + "ms")
        .addField(`Last ${pings.length} Ping`, pingsJoined)
        .setColor(embedNeon_Green)
        .setTimestamp()

        console.log(`2`)


        receivedMessage.channel.send({embed: pingEmbed})

        .then(m => m.edit({embed: {title: "Current Bot Latency", description: "(main module)", color: embedNeon_Green, fields: [{name: "Full-trip Latency", value: m.createdTimestamp - receivedMessage.createdTimestamp + "ms"}, {name: "Average Latency", value: Math.round(client.ping) + "ms"}, {name: `Last ${pings.length} Pings`, value: `${pingsJoined}`}], timestamp: new Date()}}))
        receivedMessage.react("✅");


    }
};