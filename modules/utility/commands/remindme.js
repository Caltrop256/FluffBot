'use strict';

module.exports = {
    name: 'remindme',
    aliases: ['remind', 'reminder', 'setreminder'],
    description: 'Sets a reminder for a certain period of time',
    args: true,
    usage: '<time> <reminder>',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


    execute(client, args, message) {

        var connection = client.scripts.getSQL(false);

        let params = message.content.split(" ").slice(1);
        let time = parseInt(client.time.fromString(params[0]).ms)
        if (!time) return message.reply("No time args received.")
        if (time < 60000 * 5 || isNaN(time)) return message.reply("Reminders must be set more than 5 minutes in the Future.")
        var reminder = args.join(" ").slice(args[0].length)
        if (!reminder) reminder = "No reason."
        if (reminder.length > 512 || reminder.length < 2) return message.reply("Reminders must be between 2 and 512 characters in length.")


        connection.query(`SELECT * FROM remindme WHERE userid = '${message.author.id}'`, (err, rows) => {
            if (err) throw err;
            let sql;
            if (rows.length <= 10) {
                sql = `INSERT INTO remindme (channelid, userid, reminder, expiry, start, ID) VALUES ('${message.channel.id}', '${message.author.id}', ?, ${Date.now() + time}, ${Date.now()}, ${Math.floor(Math.random() * 10000)});`
                connection.query(sql, [reminder], console.log)

                var ReminderEmbed = client.scripts.getEmbed()
                    .setAuthor(`Reminder set!`, message.author.displayAvatarURL, message.author.displayAvatarURL)
                    .setColor(0x4AD931)
                    .setTimestamp()
                    .setDescription(`I will remind you in \`${client.time(time, true)}\` of the following.`)
                    .addField(`Reminder`, reminder)

                message.channel.send({ embed: ReminderEmbed })
            } else {
                return message.reply(`You may not have more than 10 active reminders at once.`)
            }
        })
    }
}