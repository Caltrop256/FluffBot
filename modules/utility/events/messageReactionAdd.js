'use strict';

// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */

module.exports = {
    async execute(client, reaction, user)
    {
        var guild = reaction.message.guild;
        if (!guild || user.bot)
            return;
        var member = guild.member(user);

        let roleSelectChannel = client.channels.get('562328013371605012');
        let message_id_color = client.cfg.color1;
        let message_id_color2 = client.cfg.color2;
        let message_id_other = client.cfg.other;
        let message_id_pronouns = client.cfg.pronouns;

        let message_id = client.cfg.ruleAccept;

        function getEmoji(clr, client)
        {
            return new Promise((resolve, reject) =>
            {
                let e = clr.getEmoji(client);
                if (!e)
                {
                    clr.emojify(client)
                        .then(() => resolve(clr.getEmoji(client)))
                        .catch(() => reject('Error while emojifying'));
                };
                resolve(e);
            });
        };
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
                    return member.addRole(role)
                        .then(() =>
                        {
                            console.log(console.color.magenta(`[Role-Selection]`), `Added color role ${color.name} to ${member.displayName}`);
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
                roleIndex = (roleNameArr[0].length) + roleNameArr.indexOf(reaction.emoji.id) - 1;
                if (roleIndex - (roleNameArr[0].length - 1) === -1)
                    return reaction.remove(user.id).then(() => console.error('Removed invalid reaction'));
            }
            console.log(roleIndex, roleIDArr[roleIndex]);
            var role = guild.roles.get(roleIDArr[roleIndex]);
            member.addRole(role)
                .then(() =>
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role.name} to ${user.tag}`);
                });
        }
        else if (reaction.message.id === message_id_pronouns)
        {
            if (reaction.emoji.id === '785629845903114250')
                return user.createDM().then(dmChannel => dmChannel.send('<:heart_violet:785629845903114250>'));
            const emojiIDArr = ['785629947971895316', '785629927822589972', '785629907995852831', '785629886491918396', '785629867474812979'];
            const roleIDArr = ['784454313702326332', '784454130076352532', '784453872373465129', '784442677118107658', '784456309097103361'];
            var roleIndex = emojiIDArr.indexOf(reaction.emoji.id);
            if (roleIndex === -1)
                return reaction.remove(user.id).then(() => console.error('Removed invalid reaction'));
            console.log(roleIndex, roleIDArr[roleIndex]);
            var role = guild.roles.get(roleIDArr[roleIndex]);
            member.addRole(role)
                .then(() =>
                {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role.name} to ${user.tag}`);
                });
        }

    }

};