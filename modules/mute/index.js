'use strict';

module.exports = require(process.env.tropbot + '/genericModule.js');
module.exports.Info({
    name: 'mute',
    desc: 'module containing mute related commands'
});

const Discord = require('discord.js')
module.exports.ModuleSpecificCode = function (client) {

    /**makes an entry in the mute database
     * @param  {TropBot} client
     * @param  {Snowflake} userId
     * @param  {Snowflake} modId
     * @param  {Number} expiry
     * @param  {Number} start
     * @param  {Guild} guild
     * @param  {Boolean} self
     * @param  {Snowflake} channel
     */
    function muteUser(client, userId, modId, expiry, start, guild, self = false, channel = null) {
        return new Promise((resolve, reject) => {
            if (userId == modId) self = true;
            var connection = client.scripts.getSQL(false);
            connection.query(`select * from mute WHERE id = ${userId}`, (err, rows) => {
                if (err) return reject(err);

                var channelsArr = [];
                var guildWide = 0;

                rows.forEach(r => {
                    if (r.channel) {
                        channelsArr.push(r.channel);
                    } else if (r.expiry - Date.now() > guildWide) guildWide = r.expiry - Date.now();
                });
                if (channel && channelsArr.includes(channel)) {
                    var dontContinue = true;
                    return reject('Already muted in this Channel');
                };
                if (guildWide) {
                    var dontContinue = true;
                    return reject(`Already muted globally, expires in ${guildWide}`);
                };

                if (!dontContinue) {
                    connection.query(`INSERT INTO mute (id, invokinguser, expiry, guild, start, selfmute, channel) VALUES ('${userId}', '${modId}', ${expiry}, '${guild.id}', ${start}, ${Number(self)}, ${channel ? `'${channel}'` : 'NULL'})`, async (err, rows) => {
                        if (err) return reject(err);

                        var user = await client.fetchUser(userId, true);
                        var mod = await client.fetchUser(modId, true);

                        var member = guild.member(user);


                        var embed = client.scripts.getEmbed()
                            .setAuthor(user.tag, user.displayAvatarURL)
                            .setDescription(`**${user} has ${self ? '' : 'been'} muted ${self ? 'themselves' : `by ${mod}`} from ${channel ? `${client.channels.get(channel)}` : guild.name}**\n\nExpires in \`${client.time(expiry - Date.now(), true)}\`${channel ? `\nMuted in: ${client.channels.get(channel)} ${channelsArr.length ? `, ${client.scripts.endListWithAnd(channelsArr.map(c => client.channels.get(c)))}` : ""}` : ''}`)
                            .setFooter(`ID: ${userId}`)
                            .setTimestamp()
                            .setColor(client.constants.perfectOrange.hex);

                        var muteRole = guild.roles.find(r => r.name.toLowerCase() == 'muted')

                        if (channel) {
                            client.channels.get(channel).overwritePermissions(member, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false
                            }, `Muted by ${mod.tag}`)
                        } else {
                            member.addRole(muteRole.id, `Muted by ${mod.tag}`)
                        };

                        client.channels.get(client.constants.modLogs).send({ embed });

                        var DmEmbed = client.scripts.getEmbed()
                            .setTimestamp()
                            .setColor(self ? client.constants.neonPink.hex : client.constants.perfectOrange.hex)
                            .setDescription(`Your ${self ? 'self' : ''}mute will expire in \`${client.time(expiry - Date.now(), true)}\``)
                            .setAuthor(`You've ${self ? '' : 'been'} muted ${self ? 'yourself' : ''} from ${channel ? `#${client.channels.get(channel).name}` : `${guild.name}`}`);
                        if (!self) DmEmbed.setFooter(`Muted by: ${mod.tag} (${modId})`);

                        user.send({ embed: DmEmbed });

                        resolve(true);
                    });
                } else {
                    reject('an Error occured');
                }
            });
        });
    };
    function unmuteUser(client, userId, auto = false, channel = null) {
        return new Promise((resolve, reject) => {
            var connection = client.scripts.getSQL(false);
            connection.query(`select * from mute WHERE id = '${userId}' AND channel ${channel ? `= '${channel}'` : `IS NULL`}`, (err, rows) => {
                if (err) return reject(err);
                if (!rows.length) return reject(`The user isn't muted in ${channel ? client.channels.get(channel).toString() : `this Guild (globally)`}`);

                connection.query(`DELETE FROM mute WHERE id = '${userId}' AND channel ${channel ? `= '${channel}'` : `IS NULL`}`, async (err, delRows) => {
                    if (err) return reject(err);

                    var mGuild = client.guilds.get(rows[0].guild) || client.guilds.get('562324876330008576');
                    var user = await client.fetchUser(userId, true);
                    var member = mGuild.member(user);
                    var self = !!rows[0].selfmute;

                    if (channel) {
                        client.channels.get(channel).overwritePermissions(member, {
                            SEND_MESSAGES: null,
                            ADD_REACTIONS: null
                        }, `${user.tag} unmuted`);
                    } else {
                        var muteRole = mGuild.roles.find(r => r.name.toLowerCase() == 'muted');
                        member.removeRole(muteRole);
                    };

                    var embed = client.scripts.getEmbed()
                        .setAuthor(user.tag, user.displayAvatarURL)
                        .setDescription(`**${user}'s ${self ? 'self' : ''}mute from ${channel ? client.channels.get(channel) : mGuild.name} has ${auto ? 'automatically expired' : 'been removed'}**\n\nDuration: \`${client.time(rows[0].expiry - rows[0].start, true)}\`\nActual Duration: \`${client.time(Date.now() - rows[0].start, true)}\``)
                        .setFooter(`ID: ${userId}`)
                        .setTimestamp()
                        .setColor(client.constants.brightOrange.hex);

                    client.channels.get(client.constants.modLogs).send({ embed });

                    var DmEmbed = client.scripts.getEmbed()
                        .setTimestamp()
                        .setColor(self ? client.constants.neonPink.hex : client.constants.brightOrange.hex)
                        .setDescription(`Your ${self ? 'self' : ''}mute has ${auto ? 'automatically expired' : 'been removed'}`)
                        .setAuthor(`You've been unmuted from ${channel ? `#${client.channels.get(channel).name}` : `${mGuild.name}`}`);

                    user.send({ embed: DmEmbed });

                    resolve(true);
                });
            });
        });
    };
    function mutecooldownCheck() {
        var connection = client.scripts.getSQL(false);
        connection.query(`SELECT * FROM mute`, (err, rows) => {
            if (err) console.error(err);
            if (!rows) {
                return
            } else {
                rows.forEach(row => {
                    if (Date.now() > row.expiry && client.status === Discord.Constants.Status.READY) {
                        console.color.green(`[MUTE]`), `The mute of ${row.id} has expired!`

                        client.unmuteUser(client, row.id, true, row.channel)
                            .then(success => {
                                if (success) console.log(success);
                            })
                            .catch(err => {
                                throw err;
                            });
                    };
                });
            };
        });
    };

    client.muteUser = muteUser;
    client.unmuteUser = unmuteUser;
    this.timedFunctions.set(mutecooldownCheck, 30000);
};