'use strict';
module.exports = {
    name: 'avatar',
    aliases: ['av', 'pfp'],
    description: 'Links and displays the avatar of a user',
    args: false,
    usage: 'user',
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 5
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message)
    {
        var user = client.getMember(args.join(" "), message.guild, message.member)
        if (!user) return message.reply("Couldn't find User.")
        let isSelf = user.id == client.user.id;
        var name = isSelf ? 'My' : user.user.tag + "'s";
        var avatarURL = isSelf ? (client.lastAvatar ? client.lastAvatar.url : client.user.avatarURL) : user.user.displayAvatarURL;
        var fileName = (isSelf && client.lastAvatar) ? `${client.lastAvatar.Filename}.${client.lastAvatar.Extension}` : `avatar.${avatarURL.includes('a_') ? 'gif' : 'png'}`
        var avatarAttachment = client.scripts.getAttachment(avatarURL, fileName)
        var avatarEmbed = client.scripts.getEmbed()
            .attachFile(avatarAttachment)
            .setAuthor(`${name} Avatar`, `attachment://${fileName}`, avatarURL)
            .setImage(`attachment://${fileName}`)
            .setTimestamp()
            .setColor(user.displayHexColor)
        if (isSelf && client.lastAvatar)
            avatarEmbed.setFooter(`${client.lastAvatar.ID} | Powered by fluffyart.cheeseboye.com`)

        message.channel.send(`Link => <${avatarURL}>`, { embed: avatarEmbed }).then(msg =>
        {
            if (isSelf)
                message.channel.send(`If you would like to be notified every time I change my avatar, you can use \`${client.cfg.prefix[0]}avatarnotify\``);
        })

    }
}


