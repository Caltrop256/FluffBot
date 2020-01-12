'use strict';



module.exports = {
    name: 'myreminders',
    aliases: ['myremind'],
    description: 'Displays the reminders of the User executing the command',
    args: false,
    usage: '',
    rateLimit: {
        usages: 1,
        duration: 10,
        maxUsers: 5
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


    execute(client, args, message) {
        let warnUser = message.member

        var connection = client.scripts.getSQL(false);

        connection.query(`SELECT * FROM remindme WHERE userid = '${warnUser.id}'`, (err, rows) => {
            if (err) throw message.reply(err);
            var warnCountEmbed = client.scripts.getEmbed()
                .setAuthor(`${warnUser.displayName}'s Reminds`, warnUser.user.avatarURL, warnUser.user.avatarURL)
                .setDescription(`**Below you will find a list of ${warnUser.displayName}'s ${rows.length} active reminders**`)
                .setColor(0x74B979)

            if (rows.length > 0) {
                rows.forEach(row => {
                    var invokingMember = message.guild.members.get(row.invokinguser)
                    warnCountEmbed.addField(`ID: ${row.ID}`, `\nExpires in: \`${client.time(row.expiry - Date.now(), true)}\`\nApplied \`${client.time(Date.now() - row.start, true)} ago\`\nReminder: \`${row.reminder}\``, true)

                });
                message.reply(`I have sent you a list of your reminders.`)
                message.author.send({ embed: warnCountEmbed })
                    .catch(error => {
                        console.error(`Could not send help DM to a user.\n`, error);
                        message.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
                    })
            } else {
                message.reply("You don't have any active reminders set right now.")
            }


        })
    }
}