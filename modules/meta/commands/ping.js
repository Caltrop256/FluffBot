'use strict';

module.exports = {
    name: 'ping',
    aliases: ['pong', 'latency', 'lat', 'pings'],
    description: 'Displays the current Latency of the Bot',
    args: false,
    usage: '',
    rateLimit: {
        usages: 2,
        duration: 40,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {

        let pings = client.pings.map(function (e) { return "\`" + e + "ms\`" });
        let pingsJoined = pings.join(", ").replace(/, ([^,]*)$/, ' and $1')

        var pingEmbed = client.scripts.getEmbed()
            .setTitle("Current Bot Latency")
            .setDescription("tropbot-" + client.useBeta ? "beta" : "main")
            .addField('Latency', `API: **calculating**\nWebsocket (Average): **${Math.round(client.ping)}ms**\nLast ${pings.length} Socket Ping${pings.length == 1 ? "" : "s"}: **${pingsJoined}**`)
            .setColor(message.member.displayHexColor)
            .setTimestamp();
        message.channel.send({ embed: pingEmbed })
            .then(m => {
                pingEmbed.fields[0].value = pingEmbed.fields[0].value.replace(/calculating/g, m.createdTimestamp - message.createdTimestamp + "ms");
                m.edit({ embed: pingEmbed });
                message.react("✅");
            });
    }
};