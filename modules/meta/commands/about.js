module.exports = {
    name: 'about',
    aliases: ['whothis'],
    description: 'Shows a small about embed',
    args: false,
    usage: '',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: [],

    execute(client, args, message)
    {
        const AboutEmbed = client.scripts.getEmbed()
            .setTitle("made by and for the /r/fluffyboi community")
            .setAuthor("/r/fluffyboi Bot", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
            .setColor(client.constants.neonGreen.hex)
            .setDescription("/r/fluffyboi is a private bot used for miscellaneous use and role-management.")
            .setFooter("made by Caltrop#0001, with friendly support from ChlodAlejandro#9493 and wac#5607.")
            .setThumbnail("https://i.imgur.com/T9ACLM2.png")
            .setTimestamp("");
        message.channel.send({ embed: AboutEmbed })
    }
}
