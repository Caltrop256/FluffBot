'use strict';
const smartTruncate = require('smart-truncate');
module.exports = require(process.env.tropbot+'/genericModule.js');
module.exports.Info({
    name : 'moderation',
    desc: ''
});
module.exports.ModuleSpecificCode = function(client) {
    function removeAccents(str) {
        let accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
        let accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        str = str.split('');
        str.forEach((letter, index) => {
          let i = accents.indexOf(letter);
          if (i != -1) {
            str[index] = accentsOut[i];
          }
        })
        return str.join('');
    }
    
    function swearDetect(str) {
        str = removeAccents(str)
        var replaced = false
        const friendlyWords = ['Fettuccine Alfredo', 'Mango Yogurt', 'amigo', 'cuddlebuddy', 'fella', 'neighbour', 'friendo', 'buddy', 'companion', 'partner', 'acquaintance', 'ally', 'associate', 'colleague', 'chum', 'cohort', 'compatriot', 'comrade', 'consort', 'mate', 'pal', 'fellow Ralsei-enthusiast', 'cutie'];
        const friendlyAdj = ['cute', 'affectionate', 'ambitious', 'amiable', 'compassionate', 'considerate', 'courageous', 'courteous', 'diligent', 'empathetic','generous', 'passionate', 'reliable', 'sensible', 'sympathetic', 'witty']
        str = str.replace(/\b(?:sand)?(?:n)[aeiou1]{1,}[g6b]{1,}[aeiou16]{1,}r?s?\b/gim, function(token){ replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
        str = str.replace(/\bf[a|e]{1,}g{1,}(o{1,})?(t{1,})?/gi, function(token){replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
        str = str.replace(/tra{1,}n{1,}(!?s)?((y{1,})|(ie{1,}))/gi, function(token){replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});  
        str = str.replace(/;;friend/gi, function(token){replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
        str = str.replace(/;;adj/gi, function(token){replaced = true; return `${friendlyAdj[Math.floor(Math.random() * friendlyAdj.length)]}`;}); 
        str = str.replace(/ra{1,}g( )?(head|hat)/gi, function(token){replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
        str = str.replace(/go{1,}(a{1,}t|a{0,}te)( )?[v|f]uc[c|k](er)?/gi, function(token){replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
        str = str.replace(/cam{1,}el( )?[v|f]uc[c|k](er)?/gi, function(token){replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
        str = str.replace(/go{2,}(c|k)/gi, function(token){replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
        str = str.replace(/\bho{1,}nc?ky{1,}\b/gi, function(token){replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
        str = str.replace(/(re+)(t|d)a+r+(t|d)\b/gi, function(token){replaced = true;return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`});
        str = str.replace(/(re+)(t|d)a+r+(t|d)(e+)?(t|d)?/gi, function(token){replaced = true;return `${friendlyAdj[Math.floor(Math.random() * friendlyAdj.length)]}`});
        return {string: str, replaced: replaced}
        
    };
    function reportFunc(message,user,member = null)
    {
      if(message.author.id == user.id) return user.send('Please do not report your own messages!');
      
      var eURL = client.scripts.getImage(message);

      var embed = client.scripts.getEmbed()
      .setAuthor("Please provide additional information", user.displayAvatarURL)
      .setDescription(`**You are about to report ${message.author}(\`${message.author.username}#${message.author.discriminator}\`), please specifiy which Rule they broke. You can view the Rules [here](https://discordapp.com/channels/562324876330008576/562328097827848242)\nAlternatively, you can react with ❌ to cancel the Report.**`)
      .addField('Rule', `🇦 - **Rule 1**: Bad Faith Participation and Civility\n🇧 - **Rule 2**: Privacy\n🇨 - **Rule 3**: Disruptive Behavior\n🇩 - **Rule 4**: NSFW Content`)
      .setTimestamp()
      .setColor(member ? member.displayHexColor : client.constants.redder.hex)
      .setFooter("This report will automatically time out after 2 minutes!");
      user.send({embed}).then(async (msg) => {
          const emojis = ['🇦', '🇧', '🇨', '🇩', '❌'];
          for(let i = 0; i < emojis.length; i++) {
              await msg.react(emojis[i]);
          };
          const filter = (r, u) => {
              return !u.bot;
          };

          var reportedContents = message.content.length
              ? smartTruncate(message.content, 512)
              : "`(The reported content only included attachments)`";
          
          var messageLink = `https://discordapp.com/channels/562324876330008576/${message.channel.id}/${message.id}` 
          var reportEmbed = client.scripts.getEmbed()
          .setAuthor("User Report", message.author.avatarURL, message.avatarURL)
          .setDescription(`[Jump to message](${messageLink})`)
          .setColor(client.constants.red.hex)
          .setThumbnail(message.avatarURL)
          .addField("Reported User:", `${message.author}\n\`${message.author.tag}\`\n\`${message.author.id}\``, true)
          .addField("Reported by", `${user}\n\`${user.username}#${user.discriminator}\`\n\`${user.id}\``, true)
          .addField("Reported for", `{{RULE}}`, true)
          .addField("Message contents", reportedContents)
          .setImage(eURL)
          .setTimestamp();

          const ch = client.channels.get(client.constants.modLogs);
          let notifRole = '<@&580482521100320793>';//message.guild.roles.get("580482521100320793");

          var collector = msg.createReactionCollector(filter, {time: 120000});
          collector.on('collect', (reaction) => {
              switch(reaction.emoji.name) {
                  case emojis[0] :
                      collector.stop();
                      reportEmbed.fields[2].value = "**Rule 1**: Bad Faith Participation and Civility";
                      ch.send(notifRole, {embed: reportEmbed});
                      break;
                  case emojis[1] :
                      collector.stop();
                      reportEmbed.fields[2].value = "**Rule 2**: Privacy";
                      ch.send(notifRole, {embed: reportEmbed});
                      break;
                  case emojis[2] :
                      collector.stop();
                      reportEmbed.fields[2].value = "**Rule 3**: Disruptive Behavior";
                      ch.send(notifRole, {embed: reportEmbed});
                      break;
                  case emojis[3] :
                      collector.stop();
                      reportEmbed.fields[2].value = "**Rule 4**: NSFW Content";
                      ch.send(notifRole, {embed: reportEmbed});
                      break;
                  case emojis[4] :
                      collector.stop('stop');
                      break;
              };
          });
          collector.on('end', (collected, reason) => {
              user.send(`${collected.size
                  ? reason == "stop"
                      ? "The report has been cancelled!"
                      : `${message.author} has been reported!`
                  : `The report period of 2 minutes has ended!`
              }`);
              msg.reactions.forEach(r => {
                  r.remove(client.user);
              });
          });
      });
    }
    client.reportFunc = reportFunc;
    client.swearDetect = swearDetect;
    function pleaseForTheLoveOfGodUpdateThis()
    {
      client.guilds.forEach((guild) => 
        guild.fetchWebhooks().then(webhooks =>
          webhooks.forEach(webhook => 
            webhook.delete(100)
          )
        )
      )
    }
    this.timedFunctions.set(pleaseForTheLoveOfGodUpdateThis,120000)
    
};