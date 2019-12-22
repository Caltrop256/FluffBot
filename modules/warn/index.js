'use strict';

const Discord = require('discord.js')
module.exports = require(process.env.tropbot+'/genericModule.js');
module.exports.Info({
    name : 'warn',
    desc: ''
});

class warn {
    constructor(id, user, reason, active, mod, expiry, start, guild,level) {
        this.id = id;
        this.userId = user;
        this.reason = reason;
        this.active = !!active;
        this.modId = mod;
        this.expiry = expiry;
        this.start = start;
        this.guild = guild;
        this.level = level;
    };
};

class warnInfo {
    constructor(rows) {
        this.warns = [];
        for(let i = 0; i < rows.length; i++) {
            this.warns.push(new warn(
                rows[i].warnid,
                rows[i].userid,
                rows[i].reason,
                rows[i].active,
                rows[i].invokinguser,
                rows[i].expiry,
                rows[i].applied,
                rows[i].guild,
                rows[i].warnlevel
            ));
        };
        this.activeWarns = this.warns.filter(w => w.active);
        this.inactiveWarns = this.warns.filter(w => !w.active);
        this.warnLevel = this.activeWarns.length;
    };
};

module.exports.ModuleSpecificCode = function(client) {
    function getWarnEntries(userId, onlyActive) {
        return new Promise((resolve, reject) => {
            var connection = client.scripts.getSQL(false);
            connection.query(`SELECT * FROM warn WHERE userid = '${userId}'${!!onlyActive ? ` AND active = 1` : ''};`, (err, rows) => {
                if(err) return reject(err);
                return resolve(new warnInfo(rows));
            });
        });
    };
    function warnUser(userId, modId, guildId, reason = 'No reason provided', start = Date.now()) {
        return new Promise((resolve, reject) => {
            const ExpireConstant = 1209600000
            var connection = client.scripts.getSQL(false);
            client.getWarnEntries(userId, false).then(w => {
                let idArr = [];
                w.warns.forEach(warn => idArr.push(Math.abs(warn.id)));
                var randomNumber = Math.floor(Math.random() * 10000);
                while(idArr.includes(randomNumber)) {
                    randomNumber = Math.floor(Math.random() * 10000);
                };

                let sql = `INSERT INTO warn (userid, reason, active, invokinguser, expiry, applied, guild, warnlevel)\
                VALUES ('${userId}', ?, ${1}, '${modId}',\
                ${start + ExpireConstant}, ${start}, '${guildId}', ${w.warnLevel + 1})`

                connection.query(sql, [reason], async (err, rows) => {
                    if(err) return reject(err);
                    var uInfo = await client.getWarnEntries(userId, false);

                    var user = await client.fetchUser(userId, true);
                    var mod = await client.fetchUser(modId, true);

                    let guild = client.guilds.get(guildId)
                    
                    var embed = client.scripts.getEmbed()
                    .setAuthor(user.tag, user.displayAvatarURL)
                    .setDescription(`**${user} has been warned by ${mod}**\nReason: \`${reason}\`\n${user} is now on Warn Level \`${uInfo.warnLevel}\``)
                    .setTimestamp()
                    .setColor(client.constants.blue.hex);

                    var dmEmbed = client.scripts.getEmbed()
                    .setAuthor(`You've been warned in ${guild.name}!`)
                    .setDescription(`You've been warned in ${guild.name} by ${mod}. Your current Warn Level is now **${uInfo.warnLevel}**\n\nReason: \`${reason}\``)
                    .setTimestamp()
                    .setColor(client.constants.red.hex);

                    if(uInfo.warnLevel <= 2) {
                        //
                    } else if(uInfo.warnLevel == 3) {
                        embed.addField('Additional Punishment', '1 hour mute', true);
                        client.muteUser(client, userId, modId, Date.now() + 3600000, Date.now(), guild);
                    } else if(uInfo.warnlevel == 4) {
                        embed.addField('Additional Punishment', '1 day mute', true);
                        client.muteUser(client, userId, modId, Date.now() + 86400000, Date.now(), guild);
                    } else if(uInfo.warnLevel == 5) {
                        embed.addField('Additional Punishment', '1 week mute', true);
                        client.muteUser(client, userId, modId, Date.now() + 604800000, Date.now(), guild);
                    } else if(uInfo.warnLevel >= 6) {
                        embed.addField('Additional Punishment', 'Permanent ban', true);
                        client.guilds.get(guild).member(user).ban()
                    };

                    dmEmbed.fields = embed.fields;


                    client.channels.get(client.constants.modLogs).send({embed});
                    user.send({embed: dmEmbed});

                    return resolve(uInfo);
                });
            });
        });
    };
    function warnCooldownCheck() {
        var connection = client.scripts.getSQL(false);
        connection.query(`SELECT * FROM warn WHERE active = 1`, (err, rows) => {
            if(err) console.error(err);
            if(!rows) {
                return
            } else {
                rows.forEach(row => {
                    if (Date.now() > row.expiry  && client.status === Discord.Constants.Status.READY) {
                        connection.query(`UPDATE warn SET warnid = ${-Math.abs(row.warnid)}, active = ${0} WHERE warnid = ${row.warnid} AND userid = '${row.userid}'`, () => {
                            client.getWarnEntries(row.userid, false).then(async w => {
                                var user = await client.fetchUser(row.userid, true);
                                var embed = client.scripts.getEmbed()
                                .setAuthor(`A warn has expired`)
                                .setDescription(`Your warn level is now **${w.warnLevel}**`)
                                .setTimestamp()
                                .setColor(client.constants.blue.hex);
                                
                                user.send({embed});
                            });
                        });
                    };
                });
            };
        });
    };

    client.getWarnEntries = getWarnEntries;
    client.warnUser = warnUser;
    this.timedFunctions.set(warnCooldownCheck, 300000);
};