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

    execute(client, args, message) {
        var user = client.getMember(args.join(" "), message.guild, message.member)
        if(!user) return message.reply("Couldn't find User.")
        var name = user.id == client.user.id ?  'My' : user.user.tag+'s';
        var avatarAttachment = client.scripts.getAttachment(user.user.displayAvatarURL,'avatar.png')
        var avatarEmbed = client.scripts.getEmbed()
        .attachFile(avatarAttachment)
        .setAuthor(`${name} Avatar`, 'attachment://avatar.png' , user.user.displayAvatarURL)
        .setImage('attachment://avatar.png')
        .setTimestamp()
        .setColor(user.displayHexColor)

        message.channel.send(`Link => <${user.user.displayAvatarURL}>`, {embed: avatarEmbed}).then(msg =>{
            if(user.id == client.user.id)
                message.channel.send(`If you would like to be notified every time I change my avatar, you can use \`${client.cfg.prefix[0]}avatarnotify\``);
        })
        
   }
}


