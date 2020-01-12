// guildMemberRemove
/* Emitted whenever a member leaves a guild, or is kicked.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that has left/been kicked from the guild    */

module.exports = {
    execute(client, member) {
        var gotBanned = false
        var connection = client.scripts.getSQL(false);

        member.guild.fetchBans([false]).then(async bans => {
            bans.forEach(ban => {
                if (ban.user.id == member.id) gotBanned = true
            })

            const LeaveMember = member
            const leaveChannel = client.channels.get(client.constants.joinChannel);


            var mainGuild = client.guilds.get("562324876330008576");
            var members = Array.from(mainGuild.members.filter(m => !m.user.bot))

            if (member.guild == mainGuild) {

                var UserRoles = [];

                LeaveMember.roles.forEach(r => {
                    UserRoles.push(r.id)
                })
                for (var i = UserRoles.length - 1; i >= 0; i--) {
                    if (UserRoles[i] === "562327403477729285" || UserRoles[i] === "562586984845934601") {
                        UserRoles.splice(i, 1);
                    }
                }

                var UserRolesString = JSON.stringify(UserRoles)
                connection.query(`INSERT INTO leaveInfo (id, username, leftdate, roles) VALUES ('${LeaveMember.id}', '${LeaveMember.user.username}', ${Date.now()}, '${UserRolesString}')`)

                var arr = [];

                arr.push(LeaveMember.joinedTimestamp)

                LeaveMember.guild.members.array().forEach(m => {
                    arr.push(m.joinedTimestamp)
                });
                arr.sort((a, b) => a - b);


                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] == LeaveMember.joinedTimestamp) {
                        var joinPos = i

                        var members = Array.from(mainGuild.members.filter(m => !m.user.bot))
                        var neon_pink_heart = client.emojis.get("608779835090927661");
                        if (LeaveMember.lastMessageID) { var messageLink = `https://discordapp.com/channels/${LeaveMember.guild.id}/${LeaveMember.lastMessage.channel.id}/${LeaveMember.lastMessageID}` }

                        if (gotBanned == false) {
                            var leaveMemberinfo = client.scripts.getEmbed()
                                //.setTitle("🦀")
                                .setAuthor(`${member.user.username} is gone`, member.user.avatarURL, member.user.avatarURL)
                                .setThumbnail(member.user.avatarURL)
                                .setTimestamp()
                                .setFooter(member.id)
                                .setColor(member.displayHexColor)
                            if (!LeaveMember.lastMessageID || LeaveMember.lastMessage.channel.id == "575985149368467466") {
                                leaveMemberinfo.setDescription(`${member.user.username} was part of the community for \`${client.time(new Date() - LeaveMember.joinedTimestamp, { verbose: true, compact: true })}\` and was the \`${client.scripts.ordinalSuffix(joinPos + 1)}\` member to join.\n\n**Take good care** ${neon_pink_heart}`)
                            } else {
                                leaveMemberinfo.setDescription(`${member.user.username} was part of the community for \`${client.time(new Date() - LeaveMember.joinedTimestamp, { verbose: true, compact: true })}\` and was the \`${client.scripts.ordinalSuffix(joinPos + 1)}\` member to join.\n[Here](${messageLink}) is their last message.\n\n**Take good care** ${neon_pink_heart}`)
                            }
                        } else {
                            var leaveMemberinfo = client.scripts.getEmbed()
                                //.setTitle("🦀")
                                .setAuthor(`${member.user.username} is gone for good`, member.user.avatarURL, member.user.avatarURL)
                                .setThumbnail(member.user.avatarURL)
                                .setTimestamp()
                                .setFooter(member.id)
                                .setColor(member.displayHexColor)
                            if (!LeaveMember.lastMessageID || LeaveMember.lastMessage.channel.id == "575985149368467466") {
                                leaveMemberinfo.setDescription(`${member.user.username} was part of the community for \`${client.time(new Date() - LeaveMember.joinedTimestamp, { verbose: true, compact: true })}\` and was the \`${client.scripts.ordinalSuffix(joinPos + 1)}\` member to join.\n\n(User was Banned)`)
                            } else {
                                leaveMemberinfo.setDescription(`${member.user.username} was part of the community for \`${client.time(new Date() - LeaveMember.joinedTimestamp, { verbose: true, compact: true })}\` and was the \`${client.scripts.ordinalSuffix(joinPos + 1)}\` member to join.\n[Here](${messageLink}) is their last message.\n\n(User was Banned)`)
                            }
                        }


                        leaveChannel.send({ embed: leaveMemberinfo })



                        var topicArray = leaveChannel.topic.split("\n ")
                        console.log(topicArray)
                        topicArray[2] = `Latest Member to leave: **"${member.user.username}"**.`
                        topicArray[3] = `We now have **${members.length}** total members! :two_hearts:`

                        topicArray.length = 4

                        leaveChannel.setTopic(topicArray.join(`\n`))

                        try {
                            member.user.send("goodbye :(")
                        } catch (e) { }
                    }
                }

            }


        })
    }
}