'use strict';

// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
reaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */

module.exports = {
    async execute(client, reaction, user) {
        let roleSelectChannel = client.channels.get("562328013371605012");
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
        if ((reaction.message.id == message_id_color || reaction.message.id == message_id_color2) && !user.bot) {
            for (var i = 0; i < client.constants.Colors.length; i++) {
                let colorEmote = client.constants.Colors[i].getEmoji(client);
                if (!colorEmote) return console.error(`Unable to resolve emoji for ${client.constants.Colors[i].name}`);
                if (colorEmote.id == reaction.emoji.id) {
                    let Color = client.constants.Colors[i];
                    let role = reaction.message.guild.roles.find(r => r.name.toLowerCase() == Color.name.toLowerCase());
                    if (!role) return console.error(`Couldn't resolve role for ${Color.name}`);

                    console.log(`adding ${Color.name}`);

                    let member = reaction.message.guild.member(user);

                    var removeArr = [];
                    client.constants.Colors.forEach(clr => {
                        let role = reaction.message.guild.roles.find(r => r.name.toLowerCase() == clr.name.toLowerCase());
                        if (clr != Color && member.roles.has(role.id)) {
                            removeArr.push(role);
                            console.log(console.color.magenta(`[Role-Selection]`), `Pushed "${role.name}" to removeArray`);
                        };
                    });
                    member.removeRoles(removeArr, "Role Selection: Removed other / unselected Roles from user");
                    member.addRole(role, "Role Selection: Automatically added selected Role to user");
                }
            };
        };

        var guild = reaction.message.guild;
        const announcementEmoji = client.emojis.find(emoji => emoji.name === "Announcement_notif");
        if (reaction.emoji.name === "🗄" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Archivist"));
                    member.addRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🎮" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Gamer"));
                    member.addRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🎵" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Music"));
                    member.addRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🖊" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.id == "607203938520793098"));
                    member.addRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🌟" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Starboard_access"));
                    member.addRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.name === "🍔" && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Foodie"));
                    member.addRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                        });
                });
        }
        if (reaction.emoji.id == announcementEmoji.id && guild !== null && guild !== undefined && reaction.message.id === message_id_other) {
            guild.fetchMember(user)
                .then((member) => {
                    let role = (member.guild.roles.find(role => role.name === "Announcements"));
                    member.addRole(role)
                        .then(() => {
                            console.log(console.color.magenta(`[Role-Selection]`), `Added role ${role} to ${member.displayName}`);
                        });
                });
        }
    }
};