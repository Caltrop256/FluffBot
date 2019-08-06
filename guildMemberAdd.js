// guildMemberAdd
/* Emitted whenever a user joins a guild.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that has joined a guild    */

const Discord = require('discord.js');
const config = require("../commands/json/config.json");
const fs = require('fs');
var randomColor = require('randomcolor');
const prettyMs = require('pretty-ms');
var ordinal = require('ordinal-number-suffix')
var mysql = require('mysql');
if(config.maintenance == false) {
    var connection = mysql.createConnection({
        host     : `localhost`,
        port     : `3306`,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}else {
    var connection = mysql.createConnection({
        host     : config.mySQLHost,
        port     : config.mySQLPort,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}

const embedNeon_Green = 0x1DFF2D




module.exports = (client, member) => {
    client.lastSeen(member, `Joint the Guild`)
    member.guild.fetchInvites().then(guildInvites => {
        const ei = client.invites[member.guild.id];
        client.invites[member.guild.id] = guildInvites;
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        if(invite) var inviter = client.users.get(invite.inviter.id);
        
        var confirmMessageLink = `https://discordapp.com/channels/562324876330008576/562586739819151370/${client.cfg.ruleAccept}` 

        const joinembed = new Discord.RichEmbed()
        .setTitle("Welcome to the /r/fluffyboi Discord Server!")
        .setAuthor("/r/fluffyboi", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
        .setColor(embedNeon_Green)
        .setDescription(`We are glad that to see you join our Discord server. Make sure to read the rules and important information in the [#server-rules](https://discordapp.com/channels/562324876330008576/562586739819151370) and click on the reaction of [this message](${confirmMessageLink}) to gain access to all available channels.`)
        .setFooter("Enjoy yourself!", "")
        .setImage("")
        .setThumbnail("https://i.imgur.com/T9ACLM2.png")
        .setTimestamp()
        .setURL("https://www.reddit.com/r/fluffyboi/")
        .addField("If you have any questions or concerns, please message the moderation team.","󠀡");

        var mainGuild = client.guilds.get("562324876330008576");
        
        if(member.guild == mainGuild) {
            if(!member.user.avatarURL && (Date.now() - member.user.createdTimestamp) < 3600000 * 5) {
                member.send("You have been kicked due to likely being a bot, please either change your Avatar or wait 5 hours before trying again.")
                .then(() => {
                    member.kick()
                })
            } else {
                member.user.send({embed: joinembed})

                connection.query(`SELECT * FROM leaveInfo WHERE id = '${member.id}'`, (err, rows) => {
                    if(err) throw err;
                    if(rows.length >= 1) {
                        var Userroles = JSON.parse(rows[0].roles);
                        member.addRoles(Userroles)
                        var leaveDate = rows[0].leftdate
                        console.log(leaveDate)
                    }
            
                        const joinChannel = client.channels.get("562327921167958019");
                        const testchannel = client.channels.get("559034705459150848");
            
                        var mainGuild = client.guilds.get("562324876330008576");
                        var members = Array.from(mainGuild.members.filter(m => !m.user.bot))
            
                        var Pos = members.length
                        var OrdPos = ordinal(members.length)
                        var user = member.displayName
                        var ralsei_happy = client.emojis.get("562330227599212571");
            
            
                        const joinPhraseArray = [`I hope we can be good friends! ${ralsei_happy}`,`${user} joined the party!`, `The people of this server are now your ally. The power of fluffybois shines within ${user}!`, `Welcome to the dark world! We're always happy to have more friends down here!`]
                        let joinPhrase = joinPhraseArray[Math.floor(Math.random() * joinPhraseArray.length)]
            
            
                        var joinChannelEmbed = new Discord.RichEmbed()
                        .setAuthor(`New Castle Town Resident: ${user}!`, member.user.avatarURL, member.user.avatarURL)
                        .setDescription(joinPhrase)
                        .setThumbnail(member.user.avatarURL)
                        .setColor(randomColor())
                        .addField("Info", `Name: ${member}\nJoin Position: \`${OrdPos}\` \nAccount Age: \`${prettyMs(new Date() - member.user.createdTimestamp, {verbose: true, compact: true})}\`\nID: \`${member.id}\``)
                        .setTimestamp();
            
            
                        if(leaveDate) {
                            joinChannelEmbed.setAuthor(`${user} has rejoined the Server!`, member.user.avatarURL, member.user.avatarURL)
                            joinChannelEmbed.addField(`Rejoined!`, `${member} was gone for \`${prettyMs(Date.now() - leaveDate, {verbose: true, compact: true})}\` but has now rejoined!`)
                        }
                        if(inviter) {
                            joinChannelEmbed.fields[0].value += `\nInvited By: ${inviter.toString()} (\`${invite.code}\`)`
                        }
            
                        joinChannel.send({embed: joinChannelEmbed})
                        var topicArray = joinChannel.topic.split("\n")
                        console.log(topicArray)
                        topicArray[1] = `Latest Member to join: **"${member.user.username}"**.`
                        topicArray[3] = `We now have **${members.length}** total members! :two_hearts:`
            
                        topicArray.length = 4
            
                        joinChannel.setTopic(topicArray.join(`\n `))
            
                        //joinChannel.setTopic("**Welcome to all of our new members!** \nLatest Member to join: **'" + member.user.username + "'**. \nWe now have **" + members.length + "** total members! :two_hearts:")
                        member.addRole(member.guild.roles.get("562586984845934601"));
                        member.addRole(member.guild.roles.get("562327403477729285"))
            
                        connection.query(`DELETE FROM leaveInfo WHERE id = ${member.id};`, console.log)
                    
                })
            }
        }                
    })
}