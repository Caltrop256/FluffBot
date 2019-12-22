'use strict';

module.exports = {
    name: 'nickname',
    aliases: ['setnick', 'nick'],
    description: 'Changes the nickname of a specified user',
    args: true,
    usage: '<user> <new nickname>',
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_NICKNAMES'],

    execute(client, args, message) {

        var user = client.getMember(args[0], message.guild, null);
        if(!user) return message.reply("Couldn't find User.")

        var OldNick = user.displayName

        var newNick = args.join(" ").slice(args[0].length).replace(/(:.+:)/gi, "\\$1")

        user.setNickname(newNick, `Commmand by ${message.author.username}`)

        var nicknameChange = client.scripts.getEmbed()
        .setAuthor(`${user.user.tag}'s nickname Changed`, user.user.avatarURL, user.user.avatarURL)
        .setDescription(`\`${OldNick}\` => \`${newNick}\``)
        .setColor(user.displayHexColor)
        .setTimestamp()

        message.channel.send({embed: nicknameChange})
    }
}