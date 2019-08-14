const Discord = require('discord.js');


const embedGreen = 0x74B979

module.exports = {
    name: 'help',
    aliases: ['commands', 'sendhelp', 'aaaaa'],
    description: 'List all of my commands or info about a specific command',
    args: false,
    usage: '<command name>',
    guildOnly: false,
    rateLimit: {
        usages: 5,
        duration: 60,
        maxUsers: Infinity
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    async execute(client, arguments, receivedMessage) {
        const data = [];
        const { commands } = receivedMessage.client;

        if (!arguments.length) {

            const perm0commands = commands.filter(command => command.permLevel == 0)
            const perm1and2commands = commands.filter(command => command.permLevel == 1 || command.permLevel == 2)
            const perm3and4commands = commands.filter(command => command.permLevel == 3 || command.permLevel == 4)
            const perm5commands = commands.filter(command => command.permLevel == 5)

            var usercmds = ''
            
            await perm0commands.forEach(command => {
                usercmds = usercmds + `\`` + command.name + "\` - " + command.description + "\n"
            })
            var usercmdsarray = usercmds.split('\n')

            var useriterations = 0

            var helpEmbed = new Discord.RichEmbed()
            .setAuthor("Here is a complete list of all my commands!", client.user.avatarURL, client.user.avatarURL)
            .setDescription(`You can use \`${client.cfg.prefix}help [command name]\` to get info on a specific command!`)
            while (usercmdsarray.length > 0) {

                useriterations++

                chunk = usercmdsarray.splice(0, 15)
                if(chunk.length > 0 && useriterations < 2){helpEmbed.addField("User Commands", chunk)}
                if(chunk.length > 0 && useriterations >= 2){helpEmbed.addField("󠀡", chunk)}
                if(useriterations > 100) {
                    break
                }
            }
            var modcmds = ''
            
            await perm1and2commands.forEach(command => {
                modcmds = modcmds + `\`` + command.name + "\` - " + command.description + "\n"
            })
            var modcmdsarray = modcmds.split('\n')

            var moditterations = 0

            while (modcmdsarray.length > 0) {

                moditterations++

                chunk = modcmdsarray.splice(0, 14)
                console.log(chunk.length)
                if(chunk.length > 0 && moditterations < 2){helpEmbed.addField("Moderator Commands", chunk||"failsafe")}
                if(chunk.length > 0 && moditterations >= 2){helpEmbed.addField("󠀡󠀡", chunk)}
                console.log(moditterations)
                if(moditterations > 100) {
                    break
                }
            }
            var admincmds = ''
            
            await perm3and4commands.forEach(command => {
                admincmds = admincmds + `\`` + command.name + "\` - " + command.description + "\n"
            })
            var admincmdarray = admincmds.split('\n')

            var adminitteration = 0

            while (admincmdarray.length > 0) {

                adminitteration++

                chunk = admincmdarray.splice(0, 15)
                if(chunk.length > 0 && adminitteration < 2){helpEmbed.addField("Administrator Commands", chunk)}
                if(chunk.length > 0 && adminitteration >= 2){helpEmbed.addField("󠀡", chunk)}
                if(adminitteration > 100) {
                    break
                }
            }
            helpEmbed.addField("Bot Owner Commands", perm5commands.map(command => `\`` + command.name + "\` - " + command.description).join(',\n'), false)
            helpEmbed.setFooter("Created by Caltrop#0001")
            helpEmbed.setTimestamp();
            if(receivedMessage.guild !== null && receivedMessage.guild !== undefined) {helpEmbed.setColor(receivedMessage.member.displayHexColor)}
            else(helpEmbed.setColor(embedGreen))

            helpEmbed.fields.forEach(f => {
                if(!f.value) f.value = "󠀡"
            })

            
            
            return receivedMessage.author.send({embed: helpEmbed, split: true })
                .then((msg) => {
                    if (receivedMessage.channel.type === 'dm') return;
                    receivedMessage.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to a user.\n`, error);
                    receivedMessage.channel.send({embed: helpEmbed, split: true })
                });
        }
        const name = arguments[0].toLowerCase();
        var carray = commands.array()
        const command = carray.find(c => c.name == name) || carray.find(c => c.aliases && c.aliases.includes(name));
        var reqPage = carray.findIndex(c => c.name == name)
        
        if (!command) {
            return receivedMessage.reply(`I was unable to locate the \`${name}\` command. \nTry doing \`${client.cfg.prefix}help\` for a full list of commands.`);
        }

        var perm = client.cmd.permissions.find(perm => {
            return perm.position == command.permLevel
        })

        var Information = `Name: **${command.name}**\n`
        if(command.aliases) Information += `Aliases: \`${command.aliases.join("\`, \`").replace(/, ([^,]*)$/, ' and $1')}\`\n`
        Information += `Enabled: \`${command.Enabled}\`\nPeople who can use this command: \`${perm.group}\``

        var Usage = `**${command.description}**\n`
        Usage += `\`${client.cfg.prefix}${command.name} ${command.usage}\`\n`
        if(command.advUsage) Usage += `\n${command.advUsage.replace(/--prefcmd/gi, `${client.cfg.prefix}${command.name}`)}`


        
        var specificHelp = new Discord.RichEmbed()
        .setAuthor(`The ${command.name} Command`, client.user.avatarURL, client.user.avatarURL)
        .setTimestamp()
        .setFooter(`Command ${reqPage+1} of ${carray.length}`)
        .addField("Information", Information)
        .addField('Rate Limit', `A maximum of \`${command.rateLimit.maxUsers}\` Users may use this command up to \`${command.rateLimit.usages}\` times per \`${command.rateLimit.duration}\` second(s)`)
        .addField(`Usage`, Usage)
        if(receivedMessage.guild !== null && receivedMessage.guild !== undefined) {specificHelp.setColor(receivedMessage.member.displayHexColor)}
        else(specificHelp.setColor(embedGreen))

        
        receivedMessage.channel.send({embed: specificHelp, split: true }).then(async message => {
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

            collector.on('collect', (reaction, reactionCollector) => {
                receivedMessage.guild.fetchMember(reaction.users.last()).then(addedByMember => {
                    reaction.remove(addedByMember)
                    if(addedByMember.user.id == receivedMessage.author.id) {
                        const editImage = function(reqPage) {
                            var command = carray[reqPage]
                            var perm = client.cmd.permissions.find(perm => {
                                return perm.position == command.permLevel
                            })
                    
                            var Information = `Name: **${command.name}**\n`
                            if(command.aliases) Information += `Aliases: \`${command.aliases.join("\`, \`").replace(/, ([^,]*)$/, ' and $1')}\`\n`
                            Information += `Enabled: \`${command.Enabled}\`\nPeople who can use this command: \`${perm.group}\``
                    
                            var Usage = `**${command.description}**\n`
                            Usage += `\`${client.cfg.prefix}${command.name} ${command.usage}\`\n`
                            if(command.advUsage) Usage += `\n${command.advUsage.replace(/--prefcmd/gi, `${client.cfg.prefix}${command.name}`)}`

                            specificHelp.setAuthor(`The ${command.name} Command`, client.user.avatarURL, client.user.avatarURL)
                            specificHelp.setTimestamp()
                            specificHelp.setFooter(`Command ${reqPage+1} of ${carray.length}`)

                            specificHelp.fields = [
                                {
                                    name: "Information",
                                    value: Information
                                }, {
                                    name: "Rate Limit",
                                    value: `A maximum of \`${command.rateLimit.maxUsers}\` Users may use this command up to \`${command.rateLimit.usages}\` times per \`${command.rateLimit.duration}\` second(s)`
                                }, {
                                    name: "Usage",
                                    value: Usage
                                }
                            ];

                            message.edit({embed: specificHelp})
                        }
                        switch(reaction.emoji.name) {
                            case "⬅" :
                                if(reqPage-1 < 0) return;
                                reqPage -= 1
                                editImage(reqPage)
                                break;
                            case "➡" :
                                if(reqPage+2 > carray.length) return;
                                reqPage += 1
                                editImage(reqPage)
                                break;
                            case "⏹" :
                                reactionCollector.stop()
                                break;
                            case "🔀" :
                                reqPage = Math.floor(Math.random() * carray.length-1) + 1
                                editImage(reqPage)
                                break;
                            case "⏩" :
                                reqPage += 10
                                if(reqPage > carray.length-1) reqPage = carray.length-1
                                editImage(reqPage)
                                break;
                            case "⏪" :
                                reqPage -= 10
                                if(reqPage < 0) reqPage = 0
                                editImage(reqPage)
                                break;
                        }
                    }
                })
            })
            collector.on('end', (reaction, reactionCollector) => {
                message.clearReactions()
            })
        })
    }
}