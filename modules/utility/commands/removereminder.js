'use strict';

module.exports = {
    name: 'removereminder',
    aliases: ['rr'],
    description: 'Removes a specfic reminder of a specified user',
    args: true,
    usage: '<reminderID> <@user>',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


   execute(client, args, message) {
    var connection = client.scripts.getSQL(false);

    let warnUser = client.getMember(args[1], message.guild, message.member)
    if(!warnUser) return message.reply("Couldn't find specified user");
    let tbRemoveID = parseInt(args[0])
    if(!tbRemoveID) return message.reply(`Please provide the ReminderID of the Reminder you want to remove.\nYou can see the ReminderID when you do \`${client.cfg.prefix[0]}myreminders\`.`)
    if(isNaN(tbRemoveID)) return message.reply(`Please provide the ReminderID of the Reminder you want to remove.\nYou can see the ReminderID when you do \`${client.cfg.prefix[0]}myreminders\`.`)

    if(args.length > 1 && !message.member.hasPermission("MANAGE_MESSAGES") && message.member !== warnUser) return message.reply("You can only delete your own Reminders.")

    connection.query(`SELECT * FROM remindme WHERE userid = '${warnUser.id}' AND ID = ${parseInt(tbRemoveID)}`, (err, rows) => {
        if(err) throw err;
        if(rows.length < 1) {
            return message.reply(`\`${warnUser.displayName}\` does not have a \`${parseInt(tbRemoveID)}\` reminder.`)
        } else {
            rows.forEach(row => {
                connection.query(`DELETE FROM remindme WHERE ID = ${parseInt(tbRemoveID)} AND userid = ${warnUser.id};`, console.log)
                message.reply(`Deleted a Reminder from \`${warnUser.displayName}\` with the ID of \`${parseInt(tbRemoveID)}\``)
            })
        }
    })

   }
}