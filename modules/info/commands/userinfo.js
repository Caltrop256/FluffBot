'use strict';

var NumAbbr = require('number-abbreviate')
var numAbbr = new NumAbbr()

module.exports = {
   name: 'userinfo',
   aliases: ['uinfo', 'userinformation', 'aboutuser', 'memberinfo'],
   description: 'Displays a bunch of information about a specific member',
   args: false,
   usage: '<user>',
   rateLimit: {
      usages: 5,
      duration: 20,
      maxUsers: 10
   },
   perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


   execute(client, args, message) {
      var connection = client.scripts.getSQL(false);
      var user = client.getMember(args.join(" "), message.guild, message.member)
      if (!user) return message.reply("Couldn't find that user.")

      let arr = message.guild.members.array()
      arr.sort((a, b) => a.joinedAt - b.joinedAt);

      for (let i = 0; i < arr.length; i++) {
         if (arr[i].id == user.id) {
            var joinPos = i + 1

            var userRoles = [];
            user.roles.forEach(r => {
               if (r.name !== "@everyone") {
                  userRoles.push(r.toString())
               }
            });

            var DevicesArray = []

            if (user.presence.clientStatus) {
               if (user.presence.clientStatus.web) DevicesArray.push(`\`Browser\``);
               if (user.presence.clientStatus.mobile) DevicesArray.push(`\`Mobile\``);
               if (user.presence.clientStatus.desktop) DevicesArray.push(`\`Desktop\``);
            } else DevicesArray.push(`\`Unknown\``)

            connection.query(`SELECT * FROM coins WHERE id = '${user.id}'`, (err, rows) => {
               if (err) throw err;
               let sql;
               if (rows.length < 1) {
                  var uCoins = 0;
               } else {
                  var uCoins = rows[0].coins;
               }
               var userinfo = client.scripts.getEmbed()
                  .setAuthor(`${user.user.username}#${user.user.discriminator}`, user.user.displayAvatarURL, user.user.displayAvatarURL)
                  .setColor(user.displayHexColor)
                  .setThumbnail(user.user.displayAvatarURL)
                  .setFooter(`ID: ${user.id}`)
                  .setTimestamp()
               if (user.lastMessage !== null) { userinfo.setDescription(`${user}\n[Latest Message](https://discordapp.com/channels/${user.guild.id}/${user.lastMessage.channel.id}/${user.lastMessage.id})`) }
               else userinfo.setDescription(`${user}`)

               if (user.id !== "137832560305766400") { userinfo.addField(`General Information`, `Bot: \`${user.user.bot}\`\nJoined: \`${client.time(new Date() - user.joinedTimestamp, true)} ago\`\nAccount Age: \`${client.time(new Date() - user.user.createdTimestamp, true)}\`\nCoins: \`${numAbbr.abbreviate(uCoins, 1)} ${client.cfg.curName}\`\nJoin Position: \`${joinPos}\``, true) }
               else userinfo.addField(`General Information`, `Bot: \`true\`\nJoined: \`${client.time(new Date() - user.joinedTimestamp, true)} ago\`\nAccount Age: \`${client.time(new Date() - user.user.createdTimestamp, true)}\`\nCoins: \`${numAbbr.abbreviate(uCoins, 1)} ${client.cfg.curName}\`\nJoin Position: \`${joinPos}\``, true)

               if (user.presence.game) { userinfo.addField(`Presence`, `Appearance: \`${user.presence.status}\`\nVia: ${DevicesArray.join(", ").replace(/, ([^,]*)$/, ' and $1')}\nApplication: \`${user.presence.game}\``, true) }
               else { userinfo.addField(`Presence`, `Appearance: \`${user.presence.status}\`\nVia: ${DevicesArray.join(", ").replace(/, ([^,]*)$/, ' and $1')}`, true) }

               if (user.colorRole) { userinfo.addField(`Role Information`, `Hoist: ${user.hoistRole.toString()}\nHighest Role: ${user.highestRole.toString()}\nColor Role: ${user.colorRole.toString()}\nPermissions: ${client.scripts.endListWithAnd(client.scripts.getPerms(client, user).map(p => `\`${p.replace(/_/g, ' ').toLowerCase()}\``))}`, true) }
               else { userinfo.addField(`Role Information`, `Hoist: ${user.hoistRole.toString()}\nHighest Role: ${user.highestRole.toString()}\nPermissions: ${client.scripts.endListWithAnd(client.scripts.getPerms(client, user).map(p => `\`${p.replace(/_/g, ' ').toLowerCase()}\``))}`, true) }

               if (user.voiceChannel) { userinfo.addField(`Voice Information`, `Muted: \`${user.mute}\`\nDeafened: \`${user.deaf}\`\nCurrent Voice Channel: \`${user.voiceChannel.name}\`\nSessionID: \`${user.voiceSessionID}\``, true) }
               else userinfo.addField(`Voice Information`, `Muted: \`${user.mute}\`\nDeafened: \`${user.deaf}\``, true)

               userinfo.addField(`All Roles [${user.roles.size - 1}]`, userRoles.join(", ").replace(/, ([^,]*)$/, ' and $1'))
               if (user.user.username !== user.displayName) userinfo.setTitle(user.displayName)

               message.channel.send({ embed: userinfo })
            })



         }
      }
   }
}