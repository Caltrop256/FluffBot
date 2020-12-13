'use strict';

var NumAbbr = require('number-abbreviate')
var numAbbr = new NumAbbr()
module.exports = {
   name: 'serverinfo',
   aliases: ['sinfo', 'guildinfo', 'aboutguild', 'guild'],
   description: 'Displays a bunch of information about the Guild',
   args: false,
   usage: '',
   rateLimit: {
      usages: 1,
      duration: 10,
      maxUsers: 2
   },
   perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


   execute(client, args, message)
   {
      var connection = client.scripts.getSQL(false);

      var guild = message.guild

      var BoosterRole = message.guild.roles.get("585534616249565200")

      var BoosterArray = []

      BoosterRole.members.forEach(m =>
      {
         BoosterArray.push(m)
      })

      var now = Date.now()

      var Humans = [];
      var Bots = []
      var JoinedAt = [];
      var AccountCreated = [];

      var Online = [];
      var Idle = [];
      var DND = [];
      var Offline = [];

      var Mobile = 0
      var Browser = 0
      var Desktop = 0

      guild.members.forEach(m =>
      {
         if (!m.user.bot)
         {
            Humans.push(m)
            JoinedAt.push(m.joinedTimestamp)
            AccountCreated.push(m.user.createdTimestamp)


            if (m.presence.status == "online") Online.push(m)
            if (m.presence.status == "idle") Idle.push(m)
            if (m.presence.status == "offline") Offline.push(m)
            if (m.presence.status == "dnd") DND.push(m)

            if (m.presence.clientStatus)
            {
               if (m.presence.clientStatus.web) Browser = Browser + 1
               if (m.presence.clientStatus.mobile) Mobile = Mobile + 1
               if (m.presence.clientStatus.desktop) Desktop = Desktop + 1
            }
         } else
         {
            Bots.push(m)
         }
      })
      var TextChannels = [];
      var VoiceChannels = [];
      var membersinVoice = 0
      var Categories = [];
      guild.channels.forEach(c =>
      {
         if (c.type == "text") TextChannels.push(c)
         if (c.type == "voice") { VoiceChannels.push(c); membersinVoice = membersinVoice + 1 }
         if (c.type == "category") Categories.push(c)
      })

      var CatText = ``
      Categories.forEach(c =>
      {
         CatText = CatText + `${c.name.replace(/[^A-Za-z0-9]+/g, '').toLowerCase()} - \`${c.children.size}\`\n`
      })

      var accountAgeString = client.time(now - client.scripts.average(AccountCreated), true).str;
      var JoinedAtString = client.time(now - client.scripts.average(JoinedAt), true).str;

      var GuildAgeString = client.time(now - guild.createdTimestamp, true).str;

      connection.query(`SELECT SUM(coins) total FROM coins;`, (err, rows) =>
      {
         if (err) throw err;

         var TotalSum = rows[0].total

         let ServerFeatures = guild.features;
         let BoosterLevel = 0;
         if (ServerFeatures.includes('VANITY_URL')) BoosterLevel = 3;
         else if (ServerFeatures.includes('BANNER')) BoosterLevel = 2;
         else if (ServerFeatures.includes('ANIMATED_ICON')) BoosterLevel = 1;

         var infoEmbed = client.scripts.getEmbed()
            .setAuthor(guild.name, guild.iconURL.replace(/jpg$/g, "gif"), guild.iconURL.replace(/jpg$/g, "gif"))
            .setTitle(`Statistics and information`)
            .setColor(message.member.displayHexColor)
            .setThumbnail(guild.iconURL.replace(/jpg$/g, "gif"))
            .setImage(guild.splashURL)
            .setDescription("Thanks so much to everyone who has ever contributed to this Discord in any way, shape or Form, you guys really mean a lot to me, so thank you.\n\nAwesomeness of the person reading this: \`100%\`")
            .addField(`General Information`, `Region: \`${guild.region}\`\nCreated \`${GuildAgeString} days ago\`\nOwner: ${guild.owner}\nLarge: \`${guild.large}\``, true)
            .addField(`User Information`, `Humans: \`${Humans.length}\`\nBots: \`${Bots.length}\`\nAverage Account Age: \`${accountAgeString} days\`\nAverage Join Date: \`${JoinedAtString} days ago\``, true)
            .addBlankField()
            .addField(`Connection`, `**Appearance**:\nOnline: \`${Online.length}\`\nIdle: \`${Idle.length}\`\n Do not Disturb: \`${DND.length}\`\nInvisible: \`${Offline.length}\`\n**Connected Via**:\nDesktop: \`${Desktop}\`\nMobile: \`${Mobile}\`\nBrowser: \`${Browser}\``, true)
            .addField(`Channels`, `Textchannels: \`${TextChannels.length}\`\nVoicechannels: \`${VoiceChannels.length}\`\nCategories: \`${Categories.length}\`\nPeople in Voice: \`${membersinVoice}\``, true)
            .addField("Economy", `Money in Circulation: \`${numAbbr.abbreviate(TotalSum, 2)} ${client.cfg.curName}\``, true)
            .addField(`Nitro Boosts`, `Boost Level: \`Level ${BoosterLevel}\`\nFeatures: \`${ServerFeatures.join(", ").replace(/, ([^,]*)$/, ' and $1')}\`\n**Boosters**: ${BoosterArray.join(", ").replace(/, ([^,]*)$/, ' and $1')}`, true)
         message.channel.send({ embed: infoEmbed })
      })

   }
}