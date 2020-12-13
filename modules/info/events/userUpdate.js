// userUpdate
/* Emitted whenever a user's details (e.g. username) are changed.
PARAMETER      TYPE        DESCRIPTION
oldUser        User        The user before the update
newUser        User        The user after the update    */

module.exports = {
    execute(client, oldUser, newUser)
    {
        client.lastSeen(newUser, 'Updated their account details');
    }
}