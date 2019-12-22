

module.exports = {
    name: 'poll',
    aliases: ['createpoll'],
    description: 'Creates a Poll',
    args: true,
    usage: '<question>|<choices)>|<Poll Duration>',
    advUsage: 'Make sure to seperate choices with commas!\nExample: \`--prefcmd How are you doing?|Good,Bad,Meh|1m\`\nValid inputs for time: \`ms\`, \`s\`, \`m\`, \`h\`, \`d\`, \`w\` and \`y\`.',
    rateLimit: {
        usages: 2,
        duration: 120,
        maxUsers: 3
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {

        var issuingUser = message.member;

        var raw = args.join(" ").replace(/(?<=[\|\,])[ ]*/gim, "").replace(/( )*(?=[\,\|])/gim, "")
        if(!raw) return message.reply(`Ok no, that's not how things work around this part of town, if you wanna make a poll you gotta go play by my rules, smh.\nHere is an example for an actual poll:\n\n\`${client.cfg.prefix}poll How are you doing?|Good,Bad,Meh|1m\``)
        var strings = raw.split("|")
        if(strings.length < 2 ||strings.length > 3) return message.reply(`Ok no, that's not how things work around this part of town, if you wanna make a poll you gotta go play by my rules, smh.\nHere is an example for an actual poll:\n\n\`${client.cfg.prefix}poll How are you doing?|Good,Bad,Meh|1m\``)
        var question = strings[0]
        var options = strings[1]
        if(strings[2]) {
            if(strings[2].match(/[0-9]*(ms|s|m|h|d|w|y)$/gi)) {
                var time = client.time.fromString(strings[2]).ms
            } else time = client.time.fromString(strings[2] + "m").ms
        } else time = 60000
        if(!time) time = 60000

        if(!question) {return message.reply("You need to set a Title for your Poll.")}

        var emojiList = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟','🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿'];
        var optionsList = options.split(",")

        if(optionsList.length < 2) {return message.reply("You need to specify at least 2 choices for your Poll.")}
        if(optionsList.length > 20) {return message.reply("You may only specify 20 choices or less.")}

        let findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index)

        if(findDuplicates(optionsList).length) {
            return message.reply(`Your choices may not contain duplicates. (\`${findDuplicates(optionsList).join("\`, \`").replace(/, ([^,]*)$/, ' and $1')}\`)`)
        }
        
        var optionsText = "";
        for (var i = 0; i < optionsList.length; i++) { 
            optionsText += emojiList[i] + " " + optionsList[i] + "\n";
        }
        

        const ExpirationOfPoll = Date.now() + time
        
        var embed = client.scripts.getEmbed()
            .setTitle(question)
            .setDescription(`**Nobody has voted yet.**\n⌛ ${client.time(time, true)} remaining`)
            .addField(`Options`, optionsText)
            .setAuthor("Poll issued by " + message.author.username, message.author.displayAvatarURL)
            .setColor(message.member.displayHexColor)
            .setTimestamp()
            .setFooter(`The poll has started and will last ${client.time(time, true)}`);



        message.channel.send({embed})
            .then(async function (message) {
                var PollID = message.id
            
                client.polls.set(PollID, {
                    Expire: ExpirationOfPoll,
                    Start: Date.now(),
                    Duration: time,
                    Options: optionsList,
                    Emotes: emojiList,
                    Author: issuingUser,
                    Question: question,
                    OptionsText: optionsText
                })

                var reactionArray = [];
                for (var i = 0; i < optionsList.length; i++) { 
                    reactionArray[i] = await message.react(emojiList[i]);
                }

                const filter = (reaction, user) => {
                    return user.id !== message.author.id;
                };

                const collector = message.createReactionCollector(filter, { time: time });

                collector.on('collect', (reaction, reactionCollector) => {
                    console.log('collect');
                    message.channel.fetchMessage(message.id)
                    .then(async function (message) {

                        var validReaction = false

                        for (var i = 0; i < emojiList.length; i++) {
                            if(reaction.emoji.toString() == emojiList[i]) validReaction = true
                        }

                        if(validReaction == false) {reaction.remove(reaction.users.first().id)}

                        var reactionCountsArray = [];
                        for (var i = 0; i < optionsList.length; i++) {
                            reactionCountsArray[i] = message.reactions.get(emojiList[i]).count-1;
                        }

                        var max = -Infinity, indexMax = [];
                        for(var i = 0; i < reactionCountsArray.length; ++i)
                            if(reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                            else if(reactionCountsArray[i] === max) indexMax.push(i);

                        var leadingEmote = []

                        var UpdatedText = "";
                        if (reactionCountsArray[indexMax[0]] == 0) {
                            UpdatedText = "Nobody has voted yet."
                        } else {
                            for (var i = 0; i < indexMax.length; i++) {
                                leadingEmote.push(`${emojiList[indexMax[i]]} \`${optionsList[indexMax[i]]}\``)
                            }
                        }
                        if (leadingEmote.length == 1) UpdatedText = leadingEmote.join(", ").replace(/, ([^,]*)$/, ' and $1') + ` is currently leading!`
                        else UpdatedText = leadingEmote.join(", ").replace(/, ([^,]*)$/, ' and $1') + ` are currently leading!`
                        
                        
                        embed.setTimestamp();
                        embed.setDescription(`**${UpdatedText}**\n⌛ ${client.time(ExpirationOfPoll - Date.now(), true)} remaining`)
                        
                        message.edit("", embed);
                    });
                })
                var intervalVar = 0;
                function IntervalUpdate() {
                    message.channel.fetchMessage(message.id)
                    .then(async function (message) {

                        var Poll = client.polls.get(message.id)

                        var optionsList = Poll.Options
                        var emojiList = Poll.Emotes
                        var ExpirationOfPoll = Poll.Expire
                        var time = Poll.Duration
                        var issuingUser = Poll.Author
                        var question = Poll.Question
                        var optionsText = Poll.OptionsText

                        var reactionCountsArray = [];
                        
                        for (var i = 0; i < optionsList.length; i++) {
                            var tempReact = message.reactions.get(emojiList[i]);
                            if(!tempReact){
                                message.channel.send('An error has occurred and the poll had to be cancelled to prevent things from breaking. Sorry <:ralsei_sad:562330227775373323>')
                                clearInterval(intervalVar); 
                                client.polls.delete(message.id)
                                intervalVar = -1;  
                                return collector.stop();
                            }
                            reactionCountsArray[i] = tempReact.count-1
                        }

                        var max = -Infinity, indexMax = [];
                        for(var i = 0; i < reactionCountsArray.length; ++i)
                            if(reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                            else if(reactionCountsArray[i] === max) indexMax.push(i);

                        var leadingEmote = []

                        var UpdatedText = "";
                        if (reactionCountsArray[indexMax[0]] == 0) {
                            UpdatedText = "Nobody has voted yet."
                        } else {
                            for (var i = 0; i < indexMax.length; i++) {
                                leadingEmote.push(`${emojiList[indexMax[i]]} \`${optionsList[indexMax[i]]}\``)
                            }
                        }
                        if (leadingEmote.length == 1) UpdatedText = leadingEmote.join(", ").replace(/, ([^,]*)$/, ' and $1') + ` is currently leading!`
                        else if(leadingEmote.length > 1) UpdatedText = leadingEmote.join(", ").replace(/, ([^,]*)$/, ' and $1') + ` are currently leading!`
                        else UpdatedText = "Nobody has voted yet."
                        
                        var embed = client.scripts.getEmbed()
                        .setTitle(question)
                        .addField(`Options`, optionsText)
                        .setAuthor("Poll issued by " + issuingUser.user.username, issuingUser.user.displayAvatarURL)
                        .setColor(issuingUser.displayHexColor)
                        .setFooter(`The poll has started and will last ${client.time(time, true)}`);

                        embed.setTimestamp();
                        embed.setDescription(`**${UpdatedText}**\n⌛ ${client.time(ExpirationOfPoll - Date.now(), true)} remaining`)
                        
                        message.edit("", embed);
                    })
                }
                if(time > 30000) intervalVar = setInterval(IntervalUpdate, 30000)
                
                collector.on('end', collected => {
                    if(intervalVar === -1)  return;
                    message.channel.fetchMessage(message.id)
                    .then(async function (message) {
                        var reactionCountsArray = [];
                        for (var i = 0; i < optionsList.length; i++) {
                            reactionCountsArray[i] = message.reactions.get(emojiList[i]).count-1;
                        }

                        var max = -Infinity, indexMax = [];
                        for(var i = 0; i < reactionCountsArray.length; ++i)
                            if(reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                            else if(reactionCountsArray[i] === max) indexMax.push(i);
                
                        console.log(reactionCountsArray);
                        var winnersText = "";
                        if (reactionCountsArray[indexMax[0]] == 0) {
                            winnersText = "No one voted!"
                        } else {
                            for (var i = 0; i < indexMax.length; i++) {
                                winnersText += 
                                    emojiList[indexMax[i]] + " " + optionsList[indexMax[i]] + 
                                    " (" + reactionCountsArray[indexMax[i]] + ` ${reactionCountsArray[indexMax[i]] == 1 ? "vote" : 'votes'})\n`;
                            }
                        }
                        
                        embed.addField(`Winner(s)`, winnersText);
                        embed.setFooter(`The poll is now closed! It lasted ${client.time(time, true)}`);
                        embed.setTimestamp();
                        embed.setDescription(``)
                        
                        message.edit("", embed);

                        client.polls.delete(message.id)

                        if(intervalVar) clearInterval(intervalVar)
                    });
                });

                
                
            }).catch(console.error);
                
        return;
    }
};