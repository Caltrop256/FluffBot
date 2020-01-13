// guildMemberRemove
/* Emitted whenever a member leaves a guild, or is kicked.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that has left/been kicked from the guild    */

module.exports = {
    execute(client, member) {
        member.guild.fetchBans([false]).then(bans => {
            var gotBanned = false;
            bans.forEach(ban => {
                if (ban.user.id == member.id) gotBanned = true
            })
            if (!gotBanned) client.lastSeen(member.user, `Left or got kicked from the Guild`)
        });
    }
}