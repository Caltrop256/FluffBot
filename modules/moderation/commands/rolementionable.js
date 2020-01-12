'use strict';

module.exports = {
    name: 'rolementionable',
    aliases: ['mentionable'],
    description: 'Toggles if a Role can be mentioned or not',
    args: true,
    usage: '<role>',
    rateLimit: {
        usages: 5,
        duration: 1,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_ROLES'],

    execute(client, args, message) {
        var role = client.getRole(client, args.join(" "), message.guild);
        if (!role) return message.reply("Couldn't find role.");

        if (role.mentionable == false) {
            role.setMentionable(true, `Command by ${message.author.username}`)
            var enabledEmbed = client.scripts.getEmbed()
                .setAuthor(`Mentioning enabled`, message.author.avatarURL, message.author.avatarURL)
                .setDescription(`${role.toString()} can now be mentioned`)
                .setColor(role.color)
                .setTimestamp();
            return message.channel.send({ embed: enabledEmbed })
        }
        if (role.mentionable == true) {
            role.setMentionable(false, `Command by ${message.author.username}`)
            var DisabledEmbed = client.scripts.getEmbed()
                .setAuthor(`Mentioning disabled`, message.author.avatarURL, message.author.avatarURL)
                .setDescription(`${role.toString()} can no longer be mentioned`)
                .setColor(role.color)
                .setTimestamp();
            return message.channel.send({ embed: DisabledEmbed })
        }
    }
};