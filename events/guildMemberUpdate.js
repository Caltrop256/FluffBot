// guildMemberUpdate
/* Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the update
newMember    GuildMember        The member after the update    */

const Discord = require('discord.js');
const config = require("../commands/json/config.json");

module.exports = (client, oldMember, newMember) => {
    if(newMember.nickname) {var editedString = client.swearDetect(newMember.nickname)} else var editedString = client.swearDetect(newMember.user.username);
    if(editedString.replaced) {
        var frenlyNick = editedString.string.length > 32 ? editedString.string.toString().substring(0,29) + `...` : editedString.string;
        console.log(console.color.yellow(`[Swear Filter] [Nick / Username]`), `${frenlyNick}" | ${editedString.bitmap}`)
        newMember.setNickname(frenlyNick, `contained one or more racial slurs`);
    }

    //declare changes
    var Changes = {
        unknown: 0,
        addedRole: 1,
        removedRole: 2,
        username: 3,
        nickname: 4,
        avatar: 5
    };
    var change = Changes.unknown;

    if(newMember.user.username != oldMember.user.username)
        change = Changes.username;

    if(newMember.nickname != oldMember.nickname)
        change = Changes.nickname;

    if(newMember.user.avatarURL != oldMember.user.avatarURL)
        change = Changes.avatar;

    //log to console
    switch(change) {
        case Changes.unknown:
            break;
        case Changes.username:
            client.lastSeen(newMember, `Changed their username ('${oldMember.tag}' => '${newMember.tag}')`)
            break;
        case Changes.nickname:
            client.lastSeen(newMember, `Changed their nickname ('${oldMember.displayName}' => '${newMember.displayName}')`)
            break;
        case Changes.avatar:
            client.lastSeen(newMember, `Changed their avatar`)
            break;
    }
}