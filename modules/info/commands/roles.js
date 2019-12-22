'use strict';

module.exports = {
    name: 'roles',
    aliases: ['rolesize'],
    description: 'Shows all roles and how many users have that role',
    args: false,
    usage: '',
    rateLimit: {
        usages: 2,
        duration: 60,
        maxUsers: 2
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {

        var  debug = (args[0] == '-d');

        var roles = message.guild.roles.array()
        roles = roles.sort((a,b) => a.calculatedPosition - b.calculatedPosition).reverse()

        var leaderboardEmbed = client.scripts.getEmbed()
        .setAuthor(`All ${roles.length} roles`, message.author.avatarURL, message.author.avatarURL)
        .setDescription(`Below you will find a list of ${message.guild.name}'s ${roles.length} roles and some ${debug ? 'debug ' : ''}info about that role.`)
        .setColor(client.constants.green.hex)
        .setThumbnail(message.guild.iconURL.replace('.jpg', `.${message.guild.iconURL.includes('a_') ? 'gif' : 'png'}`))
        
        var leaderboardArray = [];
        
        roles.forEach((role) => 
            leaderboardArray.push(`${role} - ${role.members.size} User${role.members.size != 1 ? 's' : ''}${debug ? ` {ID:${role.id},Color:${role.color.toString(16)}}` : ''}`)
        );
            /*if(index % 2) {
                LeaderBoard += `${role.name.padEnd(maxLength, " -")} **${role.members.size}**\n`.replace(role.name, role.toString())
            } else LeaderBoard += `${role.name.padEnd(maxLength, "- ")} **${role.members.size}**\n`.replace(role.name, role.toString())(/)*/
        
        client.leaderboardSelect(message.channel,message,leaderboardEmbed,leaderboardArray)            
    }
}


