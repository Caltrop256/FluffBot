'use strict';

module.exports = require(process.env.tropbot + '/genericModule.js');
module.exports.Info({
    name: 'info',
    desc: ''
});
module.exports.ModuleSpecificCode = function (client)
{
    /**
     * @param  {User} user
     * @param  {String} activity
     */
    function lastSeen(user, activity)
    {
        if (!user) return
        if (user.user) user = user.user;
        var userOBJ = {
            id: user.id,
            activity: activity.toString(),
            date: Date.now(),
            tag: user.tag
        }
        client.lastSeenCollec.set(user.id, userOBJ);
    }
    /**Creates a log message in either #misc-logs or #mod-logs
     * @param  {TropBot} client
     * @param  {String} target
     * @param  {String} title
     * @param  {Array} additional
     * @param  {Snowflake} id
     * @param  {String} color
     * @param  {Boolean} priority
     */
    function createLogEntry(client, target, title, additional, id, color, priority)
    {
        var logChannel = client.channels.get(client.constants.miscLogs);
        var priorityLogChannel = client.channels.get(client.constants.modLogs);

        var info = '';
        if (Array.isArray(additional))
        {
            additional.forEach(a =>
            {
                info += `-${a}\n`
            });
        };

        var embed = client.scripts.getEmbed()
            .setAuthor(target.toString(), client.user.displayAvatarURL)
            .setDescription(`**${title}**\n\n${info}`)
            .setTimestamp()
            .setFooter(`ID: ${id}`)
            .setColor(color);

        if (priority)
        {
            priorityLogChannel.send({ embed });
        } else logChannel.send({ embed });
    }

    function lastSeenUpdate()
    {
        var connection = client.scripts.getSQL(true);
        connection.query(`SELECT * FROM lastseen`, (err, rows) =>
        {
            if (err) throw err;
            var sql = ``;
            var escapeArr = [];
            client.lastSeenCollec.forEach(user =>
            {
                var matchrow = rows.find(r => r.id == user.id)
                if (!matchrow)
                {
                    sql += `INSERT INTO lastseen (id, activity, date, tag) VALUES ('${user.id}', ?, ${user.date}, ?); `;
                    escapeArr.push(user.activity);
                    escapeArr.push(user.tag);
                } else
                {
                    sql += `UPDATE lastseen SET activity = ?, date = ${user.date}, tag = ? WHERE id = '${user.id}'; `;
                    escapeArr.push(user.activity);
                    escapeArr.push(user.tag);
                }
            })
            connection.query(sql, escapeArr)
        });
    };

    function inviteUpdate()
    {
        client.guilds.forEach(g =>
        {
            g.fetchInvites().then(guildInvites =>
            {
                client.invites[g.id] = guildInvites;
            });
        });
    };

    function botStreamInfoUpdate()
    {
        if (!client.user) return;
        client.user.setStatus('available')
        client.user.setPresence({
            game: {
                name: `TropBot v${client.constants.botInfo.version} \nU: ${client.time(Date.now() - client.startUp, false, 2).str} \nP: ${Math.floor(client.ping)}ms`,
                type: "STREAMING",
                url: "https://www.twitch.tv/caltrop_"
            }
        });
    };

    client.lastSeen = lastSeen;
    client.createLogEntry = createLogEntry;
    this.timedFunctions.set(lastSeenUpdate, 900000);
    this.timedFunctions.set(inviteUpdate, 30000);
    this.timedFunctions.set(botStreamInfoUpdate, 3000);
};