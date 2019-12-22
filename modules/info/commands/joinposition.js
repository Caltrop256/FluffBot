'use strict';


module.exports = {
    name: 'joinposition',
    aliases: ['joinpos'],
    description: 'Outputs the Join Position of a User',
    args: false,
    usage: '<UserID>',
    rateLimit: {
      usages: 3,
      duration: 20,
      maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {

        var JoinPosMember = client.getMember(args[0], message.guild, message.member)
        if(!JoinPosMember) {return message.reply("Couldn't find specified user.")}

        let arr = message.guild.members.array().filter(m => !m.user.bot); 
        arr.sort((a, b) => a.joinedAt - b.joinedAt);

        for (let i = 0; i < arr.length; i++) { 
            if (arr[i].id == JoinPosMember.id) {
                var joinPos = i
                message.guild.fetchMember(arr[i].id).then(JoinPosMember => {

                    var joinPosEmbed = client.scripts.getEmbed()
                    .setAuthor(JoinPosMember.user.username, JoinPosMember.user.avatarURL, JoinPosMember.user.avatarURL)
                    .setDescription(`Join Position: \`${joinPos + 1}\`\nJoined: \`${client.time(new Date() - JoinPosMember.joinedTimestamp, true)}\` ago`) 
                    .setColor(JoinPosMember.displayHexColor || client.constants.green.hex)
                    .setFooter(`Requested by ${message.author.username}`)
                    .setTimestamp();

                    message.channel.send({embed: joinPosEmbed})

                })
            }; 
        }
    }
}