// userUpdate
/* Emitted whenever a user's details (e.g. username) are changed.
PARAMETER      TYPE        DESCRIPTION
oldUser        User        The user before the update
newUser        User        The user after the update    */

module.exports = (client, oldUser, newUser) => {
    var guild = client.guilds.get("562324876330008576")
    guild.fetchMember(newUser)
    .then((addedByMember) => 
    { client.lastSeen(addedByMember, `Changing their Account Details`)
    })
    
}