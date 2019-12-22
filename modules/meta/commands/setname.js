'use strict';

module.exports = {
    name: 'setname',
    aliases: ['name', 'username', 'setusername'],
    description: 'Changes the Name of the Bot',
    args: true,
    usage: '<new name>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 500,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_NICKNAMES'],

    execute(client, args, message) {

        var newname = args.join(" ")
        if(newname.length < 2 || newname.length > 32) {return message.reply("Usernames must be between 2 and 32 characters long.")}

        try {client.user.setUsername(`${newname}`)

        var nameUpdateEmbed = new Discord.RichEmbed()
        .setAuthor("Successfully updated Name")
        .setTitle("new name: `" + newname + "`")
        .setColor(message.guild.me.displayHexColor)

        message.channel.send({embed: nameUpdateEmbed})

        } catch (error) {
            console.error(error);
        }
    }
}
