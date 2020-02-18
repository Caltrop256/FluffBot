// guildMemberAdd
/* Emitted whenever a user joins a guild.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that has joined a guild    */


module.exports = {
    execute(client, member) {
        member.guild.fetchInvites().then(guildInvites => {
            const ei = client.invites[member.guild.id];
            client.invites[member.guild.id] = guildInvites;
            if (ei) {
                var invite = guildInvites.find(i => (!ei.get(i.code) && i.uses) || (ei.get(i.code).uses < i.uses));
                if (invite) var inviter = client.users.get(invite.inviter.id);
            }

            var confirmMessageLink = `https://discordapp.com/channels/562324876330008576/562586739819151370/${client.cfg.ruleAccept}`

            const joinembed = client.scripts.getEmbed()
                .setTitle("Welcome to the /r/fluffyboi Discord Server!")
                .setAuthor("/r/fluffyboi", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
                .setColor(client.constants.neonGreen.hex)
                .setDescription(`We are glad that to see you join our Discord server. Make sure to read the rules and important information in the [#server-rules](https://discordapp.com/channels/562324876330008576/562586739819151370) and click on the reaction of [this message](${confirmMessageLink}) to gain access to all available channels.`)
                .setFooter("Enjoy yourself!", "")
                .setImage("")
                .setThumbnail("https://i.imgur.com/T9ACLM2.png")
                .setTimestamp()
                .setURL("https://www.reddit.com/r/fluffyboi/")
                .addField("If you have any questions or concerns, please message the moderation team.", "󠀡");

            var mainGuild = client.guilds.get("562324876330008576");

            if (member.guild == mainGuild) {
                member.user.send({
                    embed: joinembed
                });

                var connection = client.scripts.getSQL(false);
                connection.query(`SELECT * FROM leaveInfo WHERE id = '${member.id}'`, (err, rows) => {
                    try {
                        if (err) return console.error(err);
                        if (rows.length >= 1) {
                            var Userroles = JSON.parse(rows[0].roles);
                            member.addRoles(Userroles)
                            var leaveDate = rows[0].leftdate
                            console.log(leaveDate)
                        }

                        const joinChannel = client.channels.get(client.constants.joinChannel);

                        var mainGuild = client.guilds.get("562324876330008576");
                        var members = Array.from(mainGuild.members.filter(m => !m.user.bot))

                        var OrdPos = client.scripts.ordinalSuffix(members.length)
                        var user = client.scripts.isSuspect(member.user, client) ? '[Account under review]' : member.displayName;
                        var ralsei_happy = client.emojis.get("562330227599212571");


                        const joinPhraseArray = [`I hope we can be good friends! ${ralsei_happy}`, `${user} joined the party!`, `The people of this server are now your ally. The power of fluffybois shines within ${user}!`, `Welcome to the dark world! We're always happy to have more friends down here!`]
                        let joinPhrase = joinPhraseArray[Math.floor(Math.random() * joinPhraseArray.length)]


                        var joinChannelEmbed = client.scripts.getEmbed()
                            .setAuthor(`New Castle Town Resident: ${user}!`, member.user.avatarURL, member.user.avatarURL)
                            .setDescription(joinPhrase)
                            .setThumbnail(member.user.avatarURL)
                            .setColor(client.scripts.randomColor())
                            .addField("Info", `Name: ${client.scripts.isSuspect(member.user, client) ? '[Account under review]' : member}\nJoin Position: \`${OrdPos}\` \nAccount Age: \`${client.time(new Date() - member.user.createdTimestamp)}\`\nID: \`${member.id}\``)
                            .setTimestamp();


                        if (leaveDate) {
                            joinChannelEmbed.setAuthor(`${user} has rejoined the Server!`, member.user.avatarURL, member.user.avatarURL)
                            joinChannelEmbed.addField(`Rejoined!`, `${client.scripts.isSuspect(member.user, client) ? '[Account under review]' : member} was gone for \`${client.time(Date.now() - leaveDate)}\` but has now rejoined!`)
                        }
                        if (inviter) {
                            joinChannelEmbed.fields[0].value += `\nInvited By: ${inviter.toString()} (\`${invite.code}\`)`
                        }

                        joinChannel.send({
                            embed: joinChannelEmbed
                        })
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
                    } catch (e) {
                        console.error(e);
                    }
                })
            }
        })
    }
}