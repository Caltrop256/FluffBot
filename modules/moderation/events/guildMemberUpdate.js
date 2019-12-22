// guildMemberUpdate
/* Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the update
newMember    GuildMember        The member after the update    */

module.exports = {
    execute(client, oldMember, newMember) {
        var editedString = newMember.nickname ? client.swearDetect(newMember.nickname) : client.swearDetect(newMember.user.username)
        if(editedString.replaced) {
            var frenlyNick = editedString.string.length > 32 ? editedString.string.toString().substring(0,29) + `...` : editedString.string;
            console.log(console.color.yellow(`[Swear Filter] [Nick / Username]`), `${frenlyNick}"`)
            newMember.setNickname(frenlyNick, `contained one or more racial slurs`);
        };
        if(!newMember.nickname) return;
        var editedNick = newMember.nickname.replace(/[^\u0621-\u064A]+/g,'');
        if(!editedNick.length) return;
        newMember.setNickname('','arabic nicknames are not funny');
        
    }
};