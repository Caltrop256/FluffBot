'use strict';



// messageReactionRemove
/* Emitted whenever a reaction is removed from a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that removed the emoji or reaction emoji     */

module.exports = {
    execute(client, reaction, user) {
        var Poll = client.polls.get(reaction.message.id)
        if (Poll) {
            reaction.message.channel.fetchMessage(reaction.message.id)
                .then(async function(message) {

                    const optionsList = Poll.Options
                    const emojiList = Poll.Emotes
                    const ExpirationOfPoll = Poll.Expire
                    const time = Poll.Duration
                    const issuingUser = Poll.Author
                    const question = Poll.Question
                    const optionsText = Poll.OptionsText

                    var reactionCountsArray = [];
                    for (var i = 0; i < optionsList.length; i++) {
                        reactionCountsArray[i] = message.reactions.get(emojiList[i]).count - 1;
                    }

                    var max = -Infinity,
                        indexMax = [];
                    for (var i = 0; i < reactionCountsArray.length; ++i)
                        if (reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                        else if (reactionCountsArray[i] === max) indexMax.push(i);

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
                    else if (leadingEmote.length > 1) UpdatedText = leadingEmote.join(", ").replace(/, ([^,]*)$/, ' and $1') + ` are currently leading!`
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
        var guild = reaction.message.guild;
        let message_id_other = client.cfg.other1;
        const announcementEmoji = client.emojis.find(emoji => emoji.name === "Announcement_notif");
        if (reaction.emoji.name === "🗄" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Archivist"));
                    member.removeRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🎮" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Gamer"));
                    member.removeRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🎵" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Music"));
                    member.removeRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🖊" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.id == "607203938520793098"));
                    member.removeRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🌟" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Starboard_access"));
                    member.removeRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🍔" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Foodie"));
                    member.removeRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.id == announcementEmoji.id && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Announcements"));
                    member.removeRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role} from ${member.displayName}`);
                        });
                });
        }
    }
};