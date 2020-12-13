'use strict';

module.exports = {
    name: 'setavatar',
    aliases: ['setpfp'],
    description: 'Changes the Avatar of the Bot',
    args: false,
    usage: '<link to image>',
    rateLimit: {
        usages: 2,
        duration: 500,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_GUILD'],

    execute(client, args, message)
    {

        if (!args.length)
        {
            var ValidURL = client.user.avatarURL

            var AvatarCurrentEmbed = client.scripts.getEmbed()
                .setAuthor("Here is my current avatar!")
                .setImage(`${ValidURL}`)
                .setColor(client.constants.neonGreen.hex)

            return message.channel.send({ embed: AvatarCurrentEmbed })
        }

        var imgURL = args[0]
        if (imgURL.toString().endsWith(".jpeg") || imgURL.toString().endsWith(".jpg") || imgURL.toString().endsWith(".png") || imgURL.toString().endsWith(".gif") || imgURL.toString().endsWith(".gifv"))
        {
            var ValidURL = imgURL.toString()
        }
        if (!ValidURL) { return message.channel.send("Not a valid Image URL") }

        if (ValidURL)
        {
            client.user.setAvatar(`${ValidURL}`).catch(err => console.log(err));

            var AvatarUpdateEmbed = client.scripts.getEmbed()
                .setAuthor("Successfully updated Avatar")
                .setImage(`${ValidURL}`)
                .setColor(message.guild.me.displayHexColor)

            message.channel.send({ embed: AvatarUpdateEmbed })
        }

        message.delete(300)

    }
}
