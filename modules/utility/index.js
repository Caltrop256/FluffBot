'use strict';

module.exports = require(process.env.tropbot + '/genericModule.js');
module.exports.Info({
    name: 'utility',
    desc: ''
});
const Discord = require('discord.js')

module.exports.ModuleSpecificCode = function (client) {

    function reminderCheck() {
        var connection = client.scripts.getSQL(false);
        connection.query(`SELECT * FROM remindme`, (err, rows) => {
            if (err) throw err;
            let sql;
            if (rows.length < 1) {
                return
            } else {
                rows.forEach(row => {
                    if (Date.now() > row.expiry && client.status === Discord.Constants.Status.READY) {
                        sql = `DELETE FROM remindme WHERE ID = '${row.ID}';`

                        var reminderChannel = client.channels.get(row.channelid);
                        var user = client.users.get(row.userid);
                        if(user && reminderChannel && channel.guild.members.has(user.id))
                        {
                            var reminderEmbed = client.scripts.getEmbed()
                                .setAuthor(`Reminder!`, user.displayAvatarURL, user.displayAvatarURL)
                                .setColor(0x4AD931)
                                .setTimestamp()
                                .setDescription(`You asked me \`${client.time(Date.now() - row.start, true)}\` ago to remind you of the following.`)
                                .addField(`Reminder`, row.reminder)

                            reminderChannel.send(user, { embed: reminderEmbed })
                        }
                        
                        connection.query(sql, console.log)

                    }
                })

            }
        })
    };
    this.timedFunctions.set(reminderCheck, 100000)
};