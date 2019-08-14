const Discord = require('discord.js');
const prettyMs = require('pretty-ms');
const ms = require('ms');
const { RichEmbed } = require('discord.js');
var pluralize = require('pluralize');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'poll',
    aliases: ['createpoll'],
    description: 'Creates a Poll',
    args: true,
    usage: '<question>|<choices)>|<Poll Duration>',
    advUsage: 'Make sure to seperate choices with commas!\nExample: \`--prefcmd How are you doing?|Good,Bad,Meh|1m\`\nValid inputs for time: \`ms\`, \`s\`, \`m\`, \`h\`, \`d\`, \`w\` and \`y\`.',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 120,
        maxUsers: 3
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

        var raw = arguments.join(" ").replace(/(?<=[\|\,])[ ]*/gim, "").replace(/( )*(?=[\,\|])/gim, "")
        if(!raw) return receivedMessage.reply(`Ok no, that's not how things work around this part of town, if you wanna make a poll you gotta go play by my rules, smh.\nHere is an example for an actual poll:\n\n\`${client.cfg.prefix}poll How are you doing?|Good,Bad,Meh|1m\``)
        var strings = raw.split("|")
        if(strings.length < 2 ||strings.length > 3) return receivedMessage.reply(`Ok no, that's not how things work around this part of town, if you wanna make a poll you gotta go play by my rules, smh.\nHere is an example for an actual poll:\n\n\`${client.cfg.prefix}poll How are you doing?|Good,Bad,Meh|1m\``)
        var question = strings[0]
        var options = strings[1]
        if(strings[2]) {
            if(strings[2].match(/[0-9]*(ms|s|m|h|d|w|y)$/gi)) {
                var time = ms(strings[2])
            } else time = ms(strings[2] + "m")
        } else time = 60000
        if(!time) time = 60000

        if(!question) {return receivedMessage.reply("You need to set a Title for your Poll.")}

        var emojiList = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟','🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿'];
        var optionsList = options.split(",")

        if(optionsList.length < 2) {return receivedMessage.reply("You need to specify at least 2 choices for your Poll.")}
        if(optionsList.length > 20) {return receivedMessage.reply("You may only specify 20 choices or less.")}

        let findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index)

        if(findDuplicates(optionsList).length) {
            return receivedMessage.reply(`Your choices may not contain duplicates. (\`${findDuplicates(optionsList).join("\`, \`").replace(/, ([^,]*)$/, ' and $1')}\`)`)
        }
        
        var optionsText = "";
        for (var i = 0; i < optionsList.length; i++) { 
            optionsText += emojiList[i] + " " + optionsList[i] + "\n";
        }
        

        const ExpirationOfPoll = Date.now() + time
        
        var embed = new RichEmbed()
            .setTitle(question)
            .setDescription(`**Nobody has voted yet.**\n⌛ ${prettyMs(time, {compact: true, verbose: true})} remaining`)
            .addField(`Options`, optionsText)
            .setAuthor("Poll issued by " + receivedMessage.author.username, receivedMessage.author.displayAvatarURL)
            .setColor(receivedMessage.member.displayHexColor)
            .setTimestamp()
            .setFooter(`The poll has started and will last ${prettyMs(time, {compact: true, verbose: true})}`);



        receivedMessage.channel.send({embed})
            .then(async function (message) {
                var PollID = message.id
            
                client.polls.set(PollID, {
                    Expire: ExpirationOfPoll,
                    Start: Date.now(),
                    Duration: time,
                    Options: optionsList,
                    Emotes: emojiList,
                    Author: receivedMessage.member,
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
                    message.channel.fetchMessage(message.id)
                    .then(async function (message) {

                        var validReaction = false

                        for (var i = 0; i < emojiList.length; i++) {
                            if(reaction.emoji.toString() == emojiList[i]) validReaction = true
                        }

                        if(validReaction == false) {reaction.remove(reaction.users.random().id)}

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
                        embed.setDescription(`**${UpdatedText}**\n⌛ ${prettyMs(ExpirationOfPoll - Date.now(), {compact: true, verbose: true})} remaining`)
                        
                        message.edit("", embed);
                    });
                })

                function IntervalUpdate() {
                    receivedMessage.channel.fetchMessage(message.id)
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
                        else if(leadingEmote.length > 1) UpdatedText = leadingEmote.join(", ").replace(/, ([^,]*)$/, ' and $1') + ` are currently leading!`
                        else UpdatedText = "Nobody has voted yet."
                        
                        var embed = new RichEmbed()
                        .setTitle(question)
                        .addField(`Options`, optionsText)
                        .setAuthor("Poll issued by " + issuingUser.user.username, issuingUser.user.displayAvatarURL)
                        .setColor(issuingUser.displayHexColor)
                        .setFooter(`The poll has started and will last ${prettyMs(time, {compact: true, verbose: true})}`);

                        embed.setTimestamp();
                        embed.setDescription(`**${UpdatedText}**\n⌛ ${prettyMs(ExpirationOfPoll - Date.now(), {compact: true, verbose: true})} remaining`)
                        
                        message.edit("", embed);
                    })
                }
                if(time > 30000) var intervalVar = setInterval(IntervalUpdate, 30000)
                
                collector.on('end', collected => {
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
                                    " (" + reactionCountsArray[indexMax[i]] + ` ${pluralize("vote", reactionCountsArray[indexMax[i]])})\n`;
                            }
                        }

                        var reg = winnersText.match(new RegExp("\n", "g"));
                        if(reg !== null) {var newlinesAmt = reg.length}
                        
                        embed.addField(`**${pluralize("Winner", newlinesAmt)}:**`, winnersText);
                        embed.setFooter(`The poll is now closed! It lasted ${prettyMs(time, {compact: true, verbose: true})}`);
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