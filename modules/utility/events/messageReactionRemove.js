'use strict';



// messageReactionRemove
/* Emitted whenever a reaction is removed from a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that removed the emoji or reaction emoji     */

module.exports = {
    execute(client, reaction, user)
    {
        var guild = reaction.message.guild;
        if (!guild || user.bot)
            return;
        var Poll = client.polls.get(reaction.message.id)
        if (Poll)
        {
            reaction.message.channel.fetchMessage(reaction.message.id)
                .then(async function (message)
                {

                    const optionsList = Poll.Options
                    const emojiList = Poll.Emotes
                    const ExpirationOfPoll = Poll.Expire
                    const time = Poll.Duration
                    const issuingUser = Poll.Author
                    const question = Poll.Question
                    const optionsText = Poll.OptionsText

                    var reactionCountsArray = [];
                    for (var i = 0; i < optionsList.length; i++)
                    {
                        reactionCountsArray[i] = message.reactions.get(emojiList[i]).count - 1;
                    }

                    var max = -Infinity,
                        indexMax = [];
                    for (var i = 0; i < reactionCountsArray.length; ++i)
                        if (reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                        else if (reactionCountsArray[i] === max) indexMax.push(i);

                    var leadingEmote = []

                    var UpdatedText = "";
                    if (reactionCountsArray[indexMax[0]] == 0)
                    {
                        UpdatedText = "Nobody has voted yet."
                    } else
                    {
                        for (var i = 0; i < indexMax.length; i++)
                        {
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

        var member = guild.member(user);
        let message_id_color = client.cfg.color1;
        let message_id_color2 = client.cfg.color2;
        let message_id_other = client.cfg.other;
        let message_id_pronouns = client.cfg.pronouns;
        if ([message_id_color, message_id_color2].includes(reaction.message.id))
        {
            for (var i = 0; i < client.constants.Colors.length; i++)
            {
                var color = client.constants.Colors[i];
                if (!color.isEmoji)
                    continue;
                let colorEmote = color.getEmoji(client);
                if (!colorEmote) return console.error(`Unable to resolve emoji for ${client.constants.Colors[i].name}`);
                if (colorEmote.id == reaction.emoji.id)
                {
                    let role = reaction.message.guild.roles.find(r => r.name.toLowerCase() == color.name.toLowerCase());
                    if (!role) return console.error(`Couldn't resolve role for ${color.name}`);
                    return member.removeRole(role)
                        .then(() =>
                        {
                            console.log(console.color.magenta(`[Role-Selection]`), `Removed color role ${color.name} from ${member.displayName}`);
                        });
                }
            };
        }
        else if (reaction.message.id === message_id_other)
        {
            const announcementEmoji = client.emojis.find(emoji => emoji.name === 'Announcement_notif');
            const codeEmoji = client.emojis.find(emoji => emoji.name === 'code');
            const roleIDArr = ['784715824027926558', '562923728862707734', '562923928935464961', '562924019704135710', '607203938520793098', '562924554666770432', '579552918479437834', '716018473796370543', '562923651679125504', '706197344357712005'];
            const roleNameArr = ['🎞️ 🗄 🎮 🎵 🖊 🌟 🍔 ⚖️'.split(' '), announcementEmoji.id, codeEmoji.id]
            var roleIndex = roleNameArr[0].indexOf(reaction.emoji.name);

            if (roleIndex === -1)
            {
                console.log(reaction.emoji.id)
                roleIndex = (roleNameArr[0].length) + roleNameArr.indexOf(reaction.emoji.id) - 1;
                if (roleIndex - (roleNameArr[0].length - 1) === -1)
                    return console.error('An invalid reaction was removed');
            }
            console.log(roleIndex, roleIDArr[roleIndex]);
            var role = guild.roles.get(roleIDArr[roleIndex]);
            member.removeRole(role)
                .then(() =>
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role.name} from ${user.tag}`);
                });
        }
        else if (reaction.message.id === message_id_pronouns)
        {
            if (reaction.emoji.id === '785629845903114250')
                return;
            const emojiIDArr = ['785629947971895316', '785629927822589972', '785629907995852831', '785629886491918396', '785629867474812979'];
            const roleIDArr = ['784454313702326332', '784454130076352532', '784453872373465129', '784442677118107658', '784456309097103361'];
            var roleIndex = emojiIDArr.indexOf(reaction.emoji.id);
            if (roleIndex === -1)
                return console.error('An invalid reaction was removed');
            console.log(roleIndex, roleIDArr[roleIndex]);
            var role = guild.roles.get(roleIDArr[roleIndex]);
            member.removeRole(role)
                .then(() =>
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Removed role ${role.name} from ${user.tag}`);
                });
        }
    }
};