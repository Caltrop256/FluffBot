// guildMemberSpeaking
/* Emitted once a guild member starts/stops speaking.
PARAMETER     TYPE                DESCRIPTION
member        GuildMember         The member that started/stopped speaking
speaking      boolean             Whether or not the member is speaking    */

module.exports = (client, member, speaking) => {
    
    client.lastSeen(member, `Talking in voice chat`)
    
}