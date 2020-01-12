'use strict';

// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */

module.exports = {
    async execute(client, reaction, user) {
        var guild = reaction.message.guild;
        if (!guild || user.bot)
            return;
        var member = guild.member(user);
        let roleSelectChannel = client.channels.get('562328013371605012');
        let message_id_color = client.cfg.color1;
        let message_id_color2 = client.cfg.color2;
        let message_id_other = client.cfg.other1;

        let message_id = client.cfg.ruleAccept;

        function getEmoji(clr, client) {
            return new Promise((resolve, reject) => {
                let e = clr.getEmoji(client);
                if (!e) {
                    clr.emojify(client)
                        .then(() => resolve(clr.getEmoji(client)))
                        .catch(() => reject('Error while emojifying'));
                };
                resolve(e);
            });
        };
        if ([message_id_color, message_id_color2].includes(reaction.message.id)) {
            for (var i = 0; i < client.constants.Colors.length; i++) {
                var color = client.constants.Colors[i];
                if (!color.isEmoji)
                    continue;
                let colorEmote = color.getEmoji(client);
                if (!colorEmote) return console.error(`Unable to resolve emoji for ${client.constants.Colors[i].name}`);
                if (colorEmote.id == reaction.emoji.id) {
                    let role = reaction.message.guild.roles.find(r => r.name.toLowerCase() == color.name.toLowerCase());
                    if (!role) return console.error(`Couldn't resolve role for ${color.name}`);
                    return member.addRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Added color role ${color.name} to ${member.displayName}`);
                        });
                }
            };
        };
        if (reaction.message.id === message_id_other) {
            const announcementEmoji = client.emojis.find(emoji => emoji.name === 'Announcement_notif');
            const roleIDArr = ['562923728862707734', '562923928935464961', '562924019704135710', '607203938520793098', '562924554666770432', '579552918479437834', '562923651679125504'];
            const roleNameArr = ['🗄🎮🎵🖊🌟🍔', announcementEmoji.id]
            var roleIndex = roleNameArr[0].indexOf(reaction.emoji.name);

            if (roleIndex === -1)
                roleIndex = roleNameArr[0].length + roleNameArr.indexOf(reaction.emoji.id) - 1;
            if (roleIndex === 4)
                return reaction.remove().then(() => console.error('Removed invalid reaction'));

            var role = guild.roles.get(roleIDArr[roleIndex]);
            member.addRole(role)
                .then(() => {
                    console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role.name} to ${user.tag}`);
                });
        }

    }
};