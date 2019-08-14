module.exports = {
    name: 'announcement',
    aliases: ['announce'],
    description: 'Enables the pinging of @announcements for 5 seconds.',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 1
    },
    permLevel: 3, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        let announcementsRole = receivedMessage.guild.roles.get("562923651679125504");
        announcementsRole.edit({mentionable: true}, ["Announcements activated"]);
        receivedMessage.react(":ralPing:562330233714507776");

        setTimeout(() => {
            announcementsRole.edit({mentionable: false}, ["Announcements deactivated"]);
            receivedMessage.react("👌");
        }, 5000);

    }
}