const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

module.exports = {
    name: 'peopleinrole',
    aliases: ['roleusers'],
    description: 'Displays all Users in a Role',
    args: true,
    usage: '<role>',
    rateLimit: {
        usages: 5,
        duration: 5,
        maxUsers: 10
    },
    perms: ['MANAGE_GUILD', 'MANAGE_ROLES'],


    async execute(client, args, message) {
        var role = client.getRole(args.join(" "), message.guild)
        if (!role) return message.reply("Couldn't find role.")

        var leaderboardEmbed = client.scripts.getEmbed()
            .setAuthor(`All People with the ${role.name} role`, message.author.avatarURL, message.author.avatarURL)
            .setDescription(`Below you will find a list of all ${role.members.size} members with the ${role.toString()} role.`)
            .setColor(0x74B979)

        var leaderboardArray = [];

        await role.members.forEach(m => {
            var rowMember = message.guild.members.get(m.id)
            LeaderboardArray.push(rowMember.toString());
        })
        client.leaderboardSelect(message.channel, message, leaderboardEmbed, leaderboardArray)
    }
}