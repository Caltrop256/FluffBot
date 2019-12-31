// message
/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
message        Message        The created message    */

var Discord = require('discord.js');
module.exports = {
    required:true,
    async execute(client, message) {
        if(message.author.bot) return; 
        
        
        let mention = client.user.toString();
        let prefixLength = 0;
        let prefixArr = [mention, " " + mention, mention + " "];
        prefixArr.push(...client.cfg.prefix);
        for(var i = 0; i < prefixArr.length; i++) {
            if(message.content.startsWith(prefixArr[i].toString())) { 
                prefixLength = prefixArr[i].toString().length;
            } else if(message.content.startsWith("-" + prefixArr[i].toString())) {
                prefixLength = prefixArr[i].toString().length + 1;
                await message.delete();
            };
        };
        if(!prefixLength) return;

        
        let fullCommand = message.content.substr(prefixLength).trim();
        let prefixUsed = message.content.substr(0,prefixLength);

        let splitCommand = fullCommand.replace(/".*?"/gi, (m) => {
            return m.replace(/ +/g, '!SPACE_DELIMITER!').replace(/"+/, "");
        }).replace(/"/g, '').split(/ +/g); 

        let primaryCommand = splitCommand[0].toLowerCase();
        let args = splitCommand.slice(1);

        args = args.map(a => a.replace(/!SPACE_DELIMITER!/g, ' '));

        console.table(args);

        if(primaryCommand.match(/^(?![a-zA-Z]).*/gi)) return;

        module.exports.processCommand(client, message, args, primaryCommand, prefixUsed);

    },

    processCommand(client, message, args, primaryCommand, prefixUsed) {
        var mostSimilar = client.getCommand(primaryCommand);
        if(mostSimilar.similarity == 100) {
            var success = module.exports.checkValidity(client, message, mostSimilar.command, mostSimilar.module, args, prefixUsed);
            if(success) {return module.exports.runCommmand(mostSimilar.command, client, args, message, mostSimilar.module)}
            else return;
        }

        if(mostSimilar.similarity >= 50) {
            return message.channel.send(client.scripts.getEmbed().setAuthor('Misspelled Command', message.author.displayAvatarURL).setDescription(`Did you mean **${prefixUsed}${mostSimilar.command.name}**? (\`${mostSimilar.similarity.toFixed(1)}%\` similarity)`))
            .then(async msg => {
                var emojis = ['✅','❎']
                await msg.react(emojis[0]);
                await msg.react(emojis[1]);
                const filter = (reaction, user) => {
                    return user.id != msg.author.id;
                };
                var collector = msg.createReactionCollector(filter, {time:60000});
                collector.on('collect',reaction => {
                    //console.log(reaction);
                    //console.log(msg.reactions);
                    console.log(emojis.includes(reaction.emoji.name));
                    if(!emojis.includes(reaction.emoji.name)) return msg.reactions.last().remove(reaction.users.first().id);
                    for(var u of reaction.users) 
                    {
                        if((u[0] != message.author.id) && (u[0] != msg.author.id)) {
                            return reaction.remove(u[0]);
                        };
                    };
                    collector.stop(); 
                    if(reaction.emoji.name == emojis[0]) {
                        var success = module.exports.checkValidity(client, message, mostSimilar.command, mostSimilar.module, args, prefixUsed);
                        if(success) { return module.exports.runCommmand(mostSimilar.command, client, args, message, mostSimilar.module) }
                        else return;
                    } else {
                        return
                    };
                });
                collector.on('end', () => {
                    msg.delete(); 
                });
            });
        };
        message.delete(5000)
        message.react("⛔")
        return message.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("Unknown Command").setDescription(`\`${primaryCommand}\` is not a known or valid Command. Try doing \`${prefixUsed}help\` for a full list of valid commands.`).setColor(client.constants.redder.hex)).then(errormessage => {errormessage.delete(5000)})
    },


    checkValidity(client, message, cmd, mod, args, usedPrefix) {
        
        if(message.channel.type !== 'text') {
            message.react('⛔');
            message.channel.send(new Discord.RichEmbed().setAuthor('Command Rejected:').setTitle('DMs are unsupported').setDescription(`We have ended support for executing commands in DMs, please try again in a Guild instead`).setColor(client.constants.redder.hex));
            return false;
        };
        var isDev = client.scripts.getPerms(client, message.member).includes('DEV');
        if(!cmd.enabled) {
            message.delete(5000);
            message.react('⛔');
            message.channel.send(new Discord.RichEmbed().setAuthor('Command Rejected:').setTitle('Command Disabled').setDescription(`The \`${cmd.name}\` command is currently disabled`).setColor(client.constants.redder.hex)).then(errormessage => {errormessage.delete(5000)})
            return false;
        };
        if(!mod.enabled) {
            message.delete(5000);
            message.react('⛔');
            message.channel.send(new Discord.RichEmbed().setAuthor('Command Rejected:').setTitle('Command Disabled').setDescription(`The \`${mod.name}\` module is currently disabled`).setColor(client.constants.redder.hex)).then(errormessage => {errormessage.delete(5000)})
            return false;
        };
        
        if(!isDev && !client.scripts.containsAllElements(client.scripts.getPerms(client, message.member), cmd.perms, false)) {
            message.delete(5000);
            message.react('⛔');
            missingPerms = client.scripts.containsAllElements(client.scripts.getPerms(client, message.member), cmd.perms, true)
            missingPerms = missingPerms.map(p => "`" + p.replace(/_/g, ' ').toLowerCase() + "`");
            message.channel.send(new Discord.RichEmbed().setAuthor('Command Rejected:').setTitle('Invalid Permissions').setDescription(`You are missing the ${client.scripts.endListWithAnd(missingPerms)} permission, which is required to use this command.`).setColor(client.constants.redder.hex)).then(errormessage => {errormessage.delete(5000)})
            return false;
        }
        if(cmd.args && !args.length) {
            message.delete(5000);
            message.react('⛔');
            message.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("You didn't provide any arguments").setDescription(`The proper usage would be: \`${usedPrefix}${cmd.name} ${cmd.usage}\``).setColor(client.constants.redder.hex)).then(errormessage => {errormessage.delete(5000)})
            return false;
        };

        if (!client.cooldowns.has(cmd.name)) {
            client.cooldowns.set(cmd.name, new Discord.Collection());
        }
        if(isDev) return true;
        const now = Date.now();
        const timestamps = client.cooldowns.get(cmd.name);
        const cooldownAmount = cmd.rateLimit.duration * 1000
    
        var cmdDuration = message.channel.id == "562328185728008204" ? cooldownAmount / 2 : cooldownAmount * 1.5

        if(timestamps.size >= cmd.rateLimit.maxUsers) {
            message.delete(5000);
            message.react("⛔");
            message.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("Rate Limited").setDescription(`Woah, slow down there Cowboy! The \`${cmd.name}\` command is limited to \`${cmd.rateLimit.maxUsers}\` Users per ${(cmdDuration / 1000).toFixed(1)} second(s).`).setColor(client.constants.redder.hex)).then(errormessage => {errormessage.delete(5000)});
            return false;
        };

        var collectionUser = timestamps.get(message.author.id)
        if (collectionUser) {
            
            const expirationTime = collectionUser.start + cmdDuration;
            const startTime = collectionUser.start
            var usages = collectionUser.uses + 1
            timestamps.set(message.author.id, {start: startTime, uses: usages});

            if (now < expirationTime && usages > cmd.rateLimit.usages) {
                const timeLeft = (expirationTime - now) / 1000;
                message.delete(5000);
                message.react("⛔");
                message.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("Rate Limited").setDescription(`Woah, slow down there Cowboy! You may only use the \`${cmd.name}\` command \`${cmd.rateLimit.usages}\` times every ${(cmdDuration / 1000).toFixed(1)} second(s), **please wait ${timeLeft.toFixed(1)} more second(s) before reusing it**`).setColor(client.constants.redder.hex)).then(errormessage => {errormessage.delete(5000)});
                return false;
            };
        } else {
            timestamps.set(message.author.id, {start: now, uses: 1});
            setTimeout(() => timestamps.delete(message.author.id), cmdDuration);
        };

        return true;
    },
    async runCommmand(c, client, args, message, mod) {
        let commandExecutionStart = Date.now();
        try {
            c.execute(client,args,message)
        } catch(error) {
            client.lastCMDErr = error;
            let errorType = error.constructor.name == `Error` ? `Unknown` : error.constructor.name
            console.log(error.stack);
            message.react("⛔");
            var developersArr = [];
            for(var i = 0; i < client.constants.botInfo.developers.length; i++) {            
                var developer = await client.fetchUser(client.constants.botInfo.developers[i]); 
                developersArr.push('**'+developer.tag+'**'); 
            };
            developers = client.scripts.endListWithAnd(developersArr,true);
            message.channel.send(client.scripts.getEmbed().setAuthor(":(").setDescription(`oh oh, you weren't supposed to see this message, if this Error persists, please message ${developersArr.length > 1 ? 'either ' : ''}${developers}`)
            .addField("Error:", "```\n" + error.message + "\n\n" + error.stack.replace(client.root, '.').replace('\\', '/').substring(0, 950 - error.message.toString().length) + "\n```" + `\n\nType: \`${errorType}\`\nModule: \`${mod.name}#${c.name}\``)
            .setColor(client.constants.redder.hex))                                                                  
        } finally {
            var connection = client.scripts.getSQL(false);
            connection.query(`SELECT * FROM cmdanal WHERE cmdname = '${c.name}'`, (err, rows) => {
                if(err) return console.error(err);
                let sql;
                if(rows.length < 1) {
                    sql = `INSERT INTO cmdanal (cmdname, uses) VALUES ('${c.name}', ${1})`;
                } else {
                    let uses = rows[0].uses;
                    sql = `UPDATE cmdanal SET uses = ${uses + 1} WHERE cmdname = '${c.name}'`;
                };
                connection.query(sql);
            });
        };
    }
};