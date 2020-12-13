'use strict';



module.exports = {
    name: 'lastseen',
    aliases: ['whereis', 'heck'],
    description: 'Displays the last known sighting and activity of a given member',
    args: true,
    usage: '<@user>',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


    execute(client, args, message)
    {
        var connection = client.scripts.getSQL(false);
        var member = client.getMember(args.join(" "), message.guild, message.member)
        if (!member) return message.reply(`Couldn't locate that user.`)

        var user = member.user

        if (user.id == message.author.id) return message.reply(`That's you...`)

        var collectionOBJ = client.lastSeenCollec.get(user.id)
        if (collectionOBJ)
        {
            var lastseenembed = client.scripts.getEmbed()
                .setAuthor(user.tag, user.avatarURL)
                .setThumbnail(user.avatarURL)
                .setDescription(`Last seen \`${client.time(Date.now() - collectionOBJ.date, true)}\` ago\nActivity: \`${collectionOBJ.activity}\``)
                .setFooter("ID: " + collectionOBJ.id)
                .setColor(message.member.displayHexColor)
                .setTimestamp();

            message.channel.send({ embed: lastseenembed })
        } else
        {
            connection.query(`SELECT * FROM lastseen WHERE id = '${user.id}'`, (err, rows) =>
            {
                if (err) throw err
                if (rows.length > 0)
                {
                    var collectionOBJ = rows[0]
                    var lastseenembed = client.scripts.getEmbed()
                        .setAuthor(user.tag)
                        .setDescription(`Last seen \`${client.time(Date.now() - collectionOBJ.date, true).str}\` ago\nActivity: \`${collectionOBJ.activity}\``)
                        .setFooter("ID: " + collectionOBJ.id)
                        .setThumbnail(user.avatarURL)
                        .setColor(message.member.displayHexColor)
                        .setTimestamp();

                    message.channel.send({ embed: lastseenembed })
                } else return message.reply(`I could not locate any activity for that user.`)
            })
        }

    }
}