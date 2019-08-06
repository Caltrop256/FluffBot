const Discord = require('discord.js');
const prettyMs = require('pretty-ms');
const config = require("./json/config.json");
var NumAbbr = require('number-abbreviate')
var numAbbr = new NumAbbr()
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

module.exports = {
    name: 'serverinfo',
    aliases: ['sinfo', 'guildinfo', 'aboutguild', 'guild'],
    description: 'Displays a bunch of information about the Guild',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
      usages: 1,
      duration: 10,
      maxUsers: 2
  },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   execute(client, arguments, receivedMessage) {
      const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

      var guild = receivedMessage.guild

      var BoosterRole = receivedMessage.guild.roles.get("585534616249565200")

      var BoosterArray = []

      BoosterRole.members.forEach(m => {
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

      guild.members.forEach(m => {
         if(!m.user.bot) {
            Humans.push(m)
            JoinedAt.push(m.joinedTimestamp)
            AccountCreated.push(m.user.createdTimestamp)


            if(m.presence.status == "online") Online.push(m)
            if(m.presence.status == "idle") Idle.push(m)
            if(m.presence.status == "offline") Offline.push(m)
            if(m.presence.status == "dnd") DND.push(m)

            if(m.presence.clientStatus) {
               if(m.presence.clientStatus.web) Browser = Browser + 1
               if(m.presence.clientStatus.mobile) Mobile = Mobile + 1
               if(m.presence.clientStatus.desktop) Desktop = Desktop + 1
            }
         } else {
            Bots.push(m)
         }
      })
      var TextChannels = [];
      var VoiceChannels = [];
      var membersinVoice = 0
      var Categories = [];
      guild.channels.forEach(c => {
         if(c.type == "text") TextChannels.push(c)
         if(c.type == "voice") {VoiceChannels.push(c); membersinVoice = membersinVoice + 1}
         if(c.type == "category") Categories.push(c)
      })

      var CatText = ``
      Categories.forEach(c => {
         CatText = CatText + `${c.name.replace(/[^A-Za-z0-9]+/g, '').toLowerCase()} - \`${c.children.size}\`\n`
      })

      var accountAgeString = `${prettyMs(now - average(AccountCreated), {verbose: true, compact: false})}`
      var JoinedAtString = `${prettyMs(now - average(JoinedAt), {verbose: true, compact: false})}`

      var GuildAgeString = prettyMs(now - guild.createdTimestamp, {verbose: true, compact: false})

      console.log(guild.features)
      connection.query(`SELECT SUM(coins) total FROM coins;`, (err, rows) => {
         if(err) throw err;

         TotalSum = rows[0].total

         var infoEmbed = new Discord.RichEmbed()
         .setAuthor(guild.name, guild.iconURL.replace(/jpg$/g, "gif"), guild.iconURL.replace(/jpg$/g, "gif"))
         .setTitle(`Statistics and information`)
         .setColor(receivedMessage.member.displayHexColor)
         .setThumbnail(guild.iconURL.replace(/jpg$/g, "gif"))
         .setImage(guild.splashURL)
         .setDescription("Thanks so much to everyone who has ever contributed to this Discord in any way, shape or Form, you guys really mean a lot to me, so thank you.\n\nAwesomeness of the person reading this: \`100%\`")
         .addField(`General Information`, `Region: \`${guild.region}\`\nCreated \`${GuildAgeString.match(/.+?(?=(days \d))/gi)} days ago\`\nOwner: ${guild.owner}\nLarge: \`${guild.large}\``, true)
         .addField(`User Information`, `Humans: \`${Humans.length}\`\nBots: \`${Bots.length}\`\nAverage Account Age: \`${accountAgeString.match(/.+?(?=(days \d))/gi)} days\`\nAverage Join Date: \`${JoinedAtString.match(/.+?(?=(days \d))/gi)} days ago\``, true)
         .addBlankField()
         .addField(`Connection`, `**Appearance**:\nOnline: \`${Online.length}\`\nIdle: \`${Idle.length}\`\n Do not Disturb: \`${DND.length}\`\nInvisible: \`${Offline.length}\`\n**Connected Via**:\nDesktop: \`${Desktop}\`\nMobile: \`${Mobile}\`\nBrowser: \`${Browser}\``, true)
         .addField(`Channels`, `Textchannels: \`${TextChannels.length}\`\nVoicechannels: \`${VoiceChannels.length}\`\nCategories: \`${Categories.length}\`\nPeople in Voice: \`${membersinVoice}\``, true)
         .addField("Economy", `Money in Circulation: \`${numAbbr.abbreviate(TotalSum, 2)} ${client.cfg.curName}\``, true)
         .addField(`Nitro Boosts`, `Boost Level: \`Level ${guild.verificationLevel - 1}\`\nFeatures: \`${guild.features.join(", ").replace(/, ([^,]*)$/, ' and $1')}\`\n**Boosters**: ${BoosterArray.join(", ").replace(/, ([^,]*)$/, ' and $1')}`, true)
         receivedMessage.channel.send({embed: infoEmbed})
     })
     
   }
}