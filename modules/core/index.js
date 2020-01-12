'use strict';
var https = require('https');
const matchSorter = require('match-sorter').default
class Similarity {
    constructor(info, sim) {
        this.cmd = info.cmd;
        this.mod = info.mod;
        this.similarity = parseInt(sim);
    };
};
class Config {
    /**
     * 
     * @param {TextChannel} chn -Target channel
     * @param {Message} msg -User Message
     * @param {Number} min -Minimum range
     * @param {Number} max -Maximum range
     * @param {Number} def  -Starting number (min by default)
     * @param {boolean} del  -Delete message after stop
     * @example
     */
    constructor(chn, msg, min, max, def = min, del) {
        this.chn = chn;
        this.usr = msg.author;
        this.min = min;
        this.max = max;
        this.def = def;
        this.del = (del == null) ? msg.deleted : del;
    }
}

module.exports = require(process.env.tropbot + '/genericModule.js');
module.exports.Info({
    name: 'core',
    desc: 'main module for the bot',
    priority: 9,
    required: true
});
module.exports.ModuleSpecificCode = function (client) {
    function getCommand(primaryCommand) {
        var mostSimilar = null;

        var simArr = new Array();

        for (const mod of client.modules.values()) {
            var command = mod.commands.get(primaryCommand) || mod.commands.find(cmd => cmd.aliases && cmd.aliases.includes(primaryCommand));
            if (command) {
                mostSimilar = { module: mod, command, similarity: 100 };
                break;
            };


            for (const cmd of mod.commands.values()) {
                simArr.push(new Similarity({ cmd: cmd, mod }, client.scripts.similarity(cmd.name, primaryCommand) * 100));
                for (const alias of cmd.aliases) {
                    simArr.push(new Similarity({ cmd: cmd, mod }, client.scripts.similarity(alias, primaryCommand) * 100));
                };
            };
        };
        if (mostSimilar) return mostSimilar;
        if (!simArr.length) return null;

        simArr.sort((a, b) => b.similarity - a.similarity);

        mostSimilar = {
            module: simArr[0].mod,
            command: simArr[0].cmd,
            similarity: simArr[0].similarity
        };
        return mostSimilar.similarity ? mostSimilar : null;
    }

    function leaderboardSelect(channel, message, leaderboardEmbed, leaderboardArray) {
        return new Promise((resolve, reject) => {
            if (leaderboardArray.length == 0) {
                return channel.send('it empty lol')
                //TODO add stuff here
            }
            var chunkArray = []
            var step = 1
            while (leaderboardArray.length > 0) {
                var chunk = leaderboardArray.splice(0, 10)
                chunkArray.push({ page: step, content: chunk })
                step++
            }
            leaderboardEmbed.addField(`Page 1`, chunkArray[0].content)
            leaderboardEmbed.setFooter(`Page 1/${chunkArray.length}`)

            client.embedSelect(leaderboardEmbed, new Config(channel, message, 0, chunkArray.length - 1), (reqPage) => {
                leaderboardEmbed.fields[0] = {
                    name: `Page ${reqPage + 1}`,
                    value: chunkArray[reqPage].content.join("\n")
                }
                leaderboardEmbed.setFooter(`Page ${reqPage + 1}/${chunkArray.length}`)
            }).then(() => resolve()).catch(() => reject());
        });
    }

    function embedSelect(embed, config, onChange) //min and max inclusive so min 0 max 100 does  0 to 100
    { //config object: {message,min,max}
        return new Promise((resolve, reject) => {

            var min = config.min;
            var max = config.max;
            var channel = config.chn;
            var embedSelector = config.usr;
            var def = config.def;
            var deleteOnEnd = config.del;

            channel.send({ embed: embed }).then(async (message) => {
                resolve();
                await message.react("⏪")
                await message.react("⬅")
                await message.react("⏹")
                await message.react("🔀")
                await message.react("➡")
                await message.react("⏩")
                const filter = (reaction, user) => {
                    return !user.bot;
                };
                const collector = message.createReactionCollector(filter, { time: 300000 });
                var reqPage = def;
                collector.on('collect', (reaction, reactionCollector) => {
                    var userReact = false;
                    reaction.users.forEach(user => {
                        if (!user.bot) reaction.remove(user);
                        if (user.id == embedSelector.id) userReact = true
                    })
                    if (userReact) {
                        switch (reaction.emoji.name) {
                            case "⬅":
                                reqPage -= 1
                                break;
                            case "➡":
                                reqPage += 1
                                break;
                            case "⏹":
                                reactionCollector.stop()
                                break;
                            case "🔀":
                                reqPage = Math.round(Math.random() * max)
                                break;
                            case "⏩":
                                reqPage += 10
                                break;
                            case "⏪":
                                reqPage -= 10
                                break;
                        }
                        if (!reactionCollector.ended) {
                            reqPage = Math.clamp(reqPage, min, max);
                            onChange(reqPage, embed)
                            message.edit({ embed: embed });
                        }
                    }
                });
                collector.on('end', (reaction, reactionCollector) => {
                    if (deleteOnEnd)
                        message.delete();
                    else
                        message.clearReactions();
                });

            }).catch(err => {
                console.log(err.stack);
                reject();
            });
        });
    }
    //#region getFunctions
    /**
     * @param  {String} str
     * @param  {Channel} self
     * @return {Channel}
     */
    var getChannel = function (str, self) { //NEED TO BE FIXED TO DEAL WITH DM CHANNELS 
        if (!str) return self;
        let mention = str.match(/^<#!?(\d+)>$/);
        var names = [];
        client.channels.forEach(c => {
            if (c.type == "text") {
                names.push(...[c.name, "#" + c.name, c.toString()]);
            }
        });
        if (str.toLowerCase() == '--r') var channel = client.channels.random();
        if (!channel) var channel = client.channels.get(str);
        if (mention && !channel) var channel = client.channels.get(mention[1]);
        if (!channel) {
            var channel = client.channels.find(c => c && c.type == "text" && c.name.toLowerCase() == str.toLowerCase())
        };
        if (!channel) {
            var matches = matchSorter(names, str);
            if (matches[0]) {
                var channel = client.channels.find(c => c && c.type == "text" && c.name.toLowerCase() == matches[0].toLowerCase()) || client.channels.find(c => c && c.type == "text" && "+" + c.name.toLowerCase() == matches[0].toLowerCase());
            };
        };
        return (channel && channel.type == "text") ? channel : undefined;
    };
    /**
     * @param  {String} str
     * @param  {Guild} guild
     * @param  {GuildMember} self
     */
    var getMember = function (str, guild, self) {
        if (!str) return self;
        let mention = str.match(/<@!?(\d+)>/);
        var names = [];
        guild.members.forEach(m => {
            names.push(...[m.displayName, m.user.username, m.user.tag]);
        });
        if (str.toLowerCase() == '--r') var member = guild.members.random();
        if (!member && !isNaN(str)) var member = guild.member(guild.members.get(str));
        if (mention && !member) var member = guild.member(guild.members.get(mention[1]));
        if (!member) {
            var member = guild.member(
                guild.members.find(member => member.user.username.toLowerCase() == str.toLowerCase()) ||
                guild.members.find(member => member.displayName.toLowerCase() == str.toLowerCase()) ||
                guild.members.find(member => member.user.tag.toLowerCase() == str.toLowerCase())
            );
        };
        if (!member) {
            var matches = matchSorter(names, str);
            if (matches[0]) {
                var member = guild.member(
                    guild.members.find(member => member.user.username.toLowerCase() == matches[0].toLowerCase()) ||
                    guild.members.find(member => member.displayName.toLowerCase() == matches[0].toLowerCase()) ||
                    guild.members.find(member => member.user.tag.toLowerCase() == matches[0].toLowerCase())
                )
            };
        };
        return member;
    };
    /**
     * @param  {String} str
     * @param  {Guild} guild
     */
    var getRole = function (client, str, guild) {
        if (!str) return undefined;
        let mention = str.match(/^<@!?(\d+)>$/);
        var names = [];
        guild.roles.forEach(r => {
            names.push(...[r.name, r.toString()]);
        });
        if (str.toLowerCase() == '--r') var role = guild.roles.random();
        if (!role) var role = guild.roles.get(str);
        if (mention && !role) var role = guild.roles.get(mention[1]);
        if (!role) {
            var role = guild.roles.find(role => role.name.toLowerCase() == str.toLowerCase());
        };
        if (!role) {
            var matches = matchSorter(names, str);
            if (matches[0]) {
                var role = guild.roles.find(r =>
                    r.name.toLowerCase() == matches[0].toLowerCase() ||
                    r.toString() == matches[0]
                );
            };
        };
        return role;
    };
    //#endregion
    client.getChannel = getChannel;
    client.getMember = getMember;
    client.getRole = getRole;
    client.getCommand = getCommand;
    client.leaderboardSelect = leaderboardSelect;
    client.embedSelect = embedSelect;
    client.embedConfig = (chn, msg, min, max, def, del) => new Config(chn, msg, min, max, def, del);
}