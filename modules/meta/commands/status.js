'use strict';


module.exports = {
    name: 'status',
    aliases: ['uptime'],
    description: 'Displays the Bot\'s status',
    args: false,
    usage: '',
    rateLimit: {
        usages: 2,
        duration: 30,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message)
    {

        var lr = new Date(client.readyTimestamp)
        var weekPassed = (client.time(new Date() - lr).day >= 7);
        let status = client.scripts.getEmbed()
            .setAuthor(`Bot Status`, client.user.avatarURL)
            .setDescription(`Uptime: \`${client.time(client.uptime, false).str}\`\nPing: \`${Math.floor(client.ping)}ms\`\nAllocated Memory: \`${Math.floor(process.memoryUsage().rss / 1024 / 1024)}mb\`\nHeap: \`${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024)}mb\` / \`${Math.ceil(process.memoryUsage().heapTotal / 1024 / 1024)}mb\`\nError List:  \`${client.lastErr.length}\``)
            .setColor(client.constants.neonPink.hex)
            .setFooter(`Latest restart${weekPassed ? `: ${lr.getUTCHours()}:${lr.getUTCMinutes()}:${lr.getUTCSeconds()} - ${lr.getUTCDate()}/${lr.getUTCMonth() + 1}/${lr.getUTCFullYear()}` : ''}`)
        if (!weekPassed) status.setTimestamp(lr);
        message.channel.send({ embed: status })
    }
};
