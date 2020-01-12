'use strict';

module.exports = {
    name: 'help',
    aliases: ['commands', 'sendhelp', 'aaaaa'],
    description: 'List all of my commands or info about a specific command',
    args: false,
    usage: '<command name>',
    rateLimit: {
        usages: 5,
        duration: 60,
        maxUsers: Infinity
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {

        if (!args.length) {
            var embed = client.scripts.getEmbed()
                .setColor(message.member.displayHexColor || client.constants.neonPink.hex)
                .setTimestamp()
                .setAuthor("Here is a complete list of all my commands!", client.user.displayAvatarURL, client.user.displayAvatarURL)
                .setDescription(`You can use \`${client.cfg.prefix[0]}help [command name]\` to get info on a specific command!`);

            client.modules.forEach(m => {
                if (m.commands.size) embed.addField(`${m.enabled ? '' : '🚫'}${m.name.charAt(0).toUpperCase() + m.name.slice(1)} Module`, m.commands.map(c => `${c.enabled ? '' : '🚫'}**${c.name}** - ${c.description}`).join("\n"));
            });

            message.author.send({ embed, split: true })
                .then((msg) => {
                    //if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to a user.\n`, error);
                    message.channel.send({ embed, split: true })
                });
        } else {
            if (args.length == 1) {
                var result = client.getCommand(args[0]);
                var cmd = result.command;
                var mod = result.module;
                var sim = result.similarity;
                var rateLimit = cmd.rateLimit;
                var aliases = '';
                cmd.aliases.forEach(alias =>
                    aliases += `\`${alias}\`, `
                );
                var permissions = client.scripts.endListWithAnd(cmd.perms.map(p => `\`${p.replace(/_/g, ' ').toLowerCase()}\``));
                aliases = aliases.length ? aliases.substring(0, aliases.length - 2) : '';
                var embed = client.scripts.getEmbed()
                    .setTitle(`Command Information`)
                    .setDescription(`Name:**${cmd.name}**\n` +
                        `Module:**${mod.name}**\n` +
                        `${cmd.aliases.length ? `Aliases:${aliases}\n` : ''}` +
                        `Enabled:\`${(cmd.enabled ? true : false)}\` ${!mod.enabled ? '(Module Disabled)' : ''}`)
                    .addField('Permissions Required', permissions.length ? permissions : 'none')
                    .addField('Rate Limit', `A maximum of \`${rateLimit.usages}\` Users may use this command up to \`${rateLimit.duration}\` times per \`${rateLimit.maxUsers}\` second(s)`)
                    .addField('Usage', `**${cmd.description}**\n\`${client.cfg.prefix[0]}${cmd.name} ${cmd.usage}\``)
                    .setFooter(`Similarity:${sim}`)
                    .setTimestamp()
                message.channel.send({ embed });
            }
            else if ((args.length == 2) && (args[0].toLowerCase() == 'module')) {
                var selectedModule = null;
                var modNameARG = args[1];
                var maxSimilarity = 49;
                client.modules.forEach((mod, modName) => {
                    var similarity = client.scripts.similarity(modName, modNameARG) * 100;
                    if (similarity > maxSimilarity) {
                        maxSimilarity = similarity;
                        selectedModule = mod;
                    }
                });
                if (!selectedModule) return message.reply('no module found'); //placeholder
                var modCommands = '';
                selectedModule.commands.forEach((com, comName) =>
                    modCommands += comName + '\n'
                );
                var embed = client.scripts.getEmbed()
                    .setTitle(`Module Information`)
                    .setDescription(`Name:**${selectedModule.name}**\n` +
                        `Description: **${selectedModule.desc}**\n` +
                        `Enabled:\`${(selectedModule.enabled ? true : false)}\``)
                    .addField('Module Commands', `${modCommands.length ? modCommands : '....what? there\'s...nothing?'}`)
                    .setFooter(`Similarity:${maxSimilarity}`)
                    .setTimestamp()
                message.channel.send({ embed });
            }
            else {
                return message.reply('invalid args'); //placeholder
            }
        };
    }
};