// guildMemberAdd
/* Emitted whenever a user joins a guild.
PARAMETER	                    TYPE	                DESCRIPTION
rateLimitInfo	                Object	                Object containing the rate limit info
rateLimitInfo.limit	            number	                Number of requests that can be made to this endpoint
rateLimitInfo.timeDifference	number	                Delta-T in ms between your system and Discord servers
rateLimitInfo.path	            string                  Path used for request that triggered this event
rateLimitInfo.method	        string	                HTTP method used for request that triggered this event

*/

module.exports = (rateLimitInfo, rateLimitInfolimit) => {
    /*console.log(`----------\nHit a rate limit!`)
    console.log(rateLimitInfolimit)*/
}