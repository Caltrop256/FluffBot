const Discord = require('discord.js');


module.exports = {
    name: 'rulesembed',
    aliases: ['rules'],
    description: 'Displays and sets up the Rule Embed',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
      usages: 2,
      duration: 60,
      maxUsers: 1
  },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

      const DarknerRole = receivedMessage.guild.roles.get("576006024918597632")

      var messages = [];
      var RuleEmbed1 = new Discord.RichEmbed()
        .setAuthor("The Rules", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
        .setDescription(`Please make sure that you have thoroughly read and have understood the rules. If you have any remaining questions or concerns, feel free to message the ${DarknerRole} about it.`)
        .setColor(0x2BA800)
        .setThumbnail("https://i.imgur.com/FmA47CL.gif")

      receivedMessage.channel.send({embed: RuleEmbed1}).then(msg => {
          messages.push(msg)
          var ruletitleLink = `https://discordapp.com/channels/562324876330008576/${msg.channel.id}/${msg.id}`
          var RuleEmbed2 = new Discord.RichEmbed()
          .setAuthor("Rule 1:")
          .setTitle("Bad Faith Participation and Civility")
          .setDescription("Remember that you are talking to another human. Always give the person you are talking to the benefit of the doubt. Avoid `spouting identity-based slurs` and being `abusive`, `abrasive`, `unreasonably offensive`, or `vitriolic`.\n**If you feel like you are unable to keep a conversation civil and respectful then it is best to leave that discussion.**")
          .setColor(0x2BA800)
          .setThumbnail("https://i.imgur.com/TpzH4kf.png")

          receivedMessage.channel.send({embed: RuleEmbed2}).then(msg => {
            messages.push(msg)
            var RuleEmbed3 = new Discord.RichEmbed()
            .setAuthor("Rule 2:")
            .setTitle("Privacy")
            .setDescription("We have a zero-tolerance rule towards doxxing, which includes publishing `phone numbers`, `street addresses`, `names`, `pictures`, `credit card information` or any other identifiable/confidential files. This also includes pressuring people into posting sensitive files. **Any suspicious behavior will result in a permanent ban and your information being forwarded to Discords Trust & Safety Team.**")
            .setColor(0x2BA800)
            .setThumbnail("https://i.imgur.com/xRFROIk.png")
            receivedMessage.channel.send({embed: RuleEmbed3}).then(msg => {
                messages.push(msg)
                var RuleEmbed4 = new Discord.RichEmbed()
                .setAuthor("Rule 3:")
                .setTitle("Disruptive Behavior")
                .setDescription(`Do not try to derail any on-going conversation or discussions. \`Posting unrelated images\`, \`mass or rapid mentioning\`,\`not speaking English\`, \`unnecessary use of caps\`, \`advertisements\`, \`ASCII art\`, \`spoiling the plot of any medium\` or anything else that the ${DarknerRole} deems inappropriate/disruptive will grant you a mute.`)
                .setColor(0x2BA800)
                .setThumbnail("https://i.imgur.com/2BAX2lh.png")
                receivedMessage.channel.send({embed: RuleEmbed4}).then(msg => {
                  messages.push(msg)
                  var rule3link = `https://discordapp.com/channels/562324876330008576/${msg.channel.id}/${msg.id}`
                  var RuleEmbed5 = new Discord.RichEmbed()
                  .setAuthor("Rule 4:")
                  .setTitle("NSFW Content")
                  .setDescription("Posting content which is traditionally called [NSFW](https://www.urbandictionary.com/define.php?term=NSFW) - short for **N**ot **S**afe **F**or **W**ork such as `Porn`, `Gore`, `sexually questionable images` or similar content is not allowed. If you are unsure if your media is allowed please contact " + DarknerRole + ".")
                  .setColor(0x2BA800)
                  .setThumbnail("https://i.imgur.com/9VbIkKF.png") 
                  receivedMessage.channel.send({embed: RuleEmbed5}).then(msg => {
                    messages.push(msg)
                    var rule4link = `https://discordapp.com/channels/562324876330008576/${msg.channel.id}/${msg.id}` 
                    var RuleEmbed6 = new Discord.RichEmbed()
                    .setFooter("Contrary to popular belief, Moderators are people too, we heavily rely on User Reports to keep the community clean and healthy. Please be patient and keep yourself level-headed when you feel like we are being unjust.", "https://i.imgur.com/FG87XKi.png")
                    .setColor(0x2BA800)
                    
                    receivedMessage.channel.send({embed: RuleEmbed6}).then(msg => {
                      messages.push(msg)
                      var InformationEmbed1 = new Discord.RichEmbed()
                      .setAuthor("Frequently Asked Questions", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
                      .setDescription("Below you'll find a few frequently asked questions with answers.")
                      .setColor(0x00A8A5)
                      .setThumbnail("https://i.imgur.com/6HihdeS.png")
                      .addField("Q: How do I receive a Role?", "**A:** You can assign yourself one of the Roles by clicking on the corresponding emoticons in [#role-selection](https://discordapp.com/channels/562324876330008576/562328013371605012). You will find a description of the function of each Role in that channel as well.\nIf you are experiencing issues while trying to assign your role, please try doing `?rank <role name>` in the [#bot-commands](https://discordapp.com/channels/562324876330008576/562328185728008204) channel. \nIf the Error persists, please message **Caltrop#0001** about it.\n[Extensive list of self-assignable Roles](https://www.reddit.com/r/fluffyboi/wiki/role-selection#wiki_list_of_roles)")
                      .addField("Q: What is a 'Lightner' and how can I become one?", "**A:** Lightners are users who have either been active for an extended period of time or have contributed something valuable to the community.\nIf you think you meet any of these requirements, feel free to message the " + DarknerRole)
                      .addField("Q: I saw someone break a Rule, what do I do?", "**A:** You can report any Rule-breaking content by reacting with the :bangbang: emoticon (:󠀡bangbang:) to the offending message.")
                      .addField("Q: I was unfairly punished by a Moderator, what do I do?", `**A:** If you think that a Moderator has unjustly punished you, please fill out [this Form](https://forms.gle/uZ7HKiHU7pzwk11JA).\nBefore reporting a Moderator, please make sure that you have read and understood the Rules, especially [Rule 3](${rule3link}) and [Rule 4](${rule4link}).`)
                      .addField("Q: My question wasn't answered by this...", `**A**: That's not a question but we can help you anyways. If your question remains unanswered you can try messaging the ${DarknerRole} or sending us a [Mod-Mail](https://www.reddit.com/message/compose?to=%2Fr%2Ffluffyboi&subject=Regarding%20the%20community%20Discord%20Server...&message=).`)
                      .setTimestamp()
                      .setFooter("Last updated on ", "https://i.imgur.com/6HihdeS.png")

                      receivedMessage.channel.send({embed: InformationEmbed1}).then(msg => {
                        messages.push(msg)
                        var ralsei_happy = client.emojis.get("562330227599212571");
                        var InviteEmbed = new Discord.RichEmbed()
                        .setAuthor("Our Invite Link!", "https://i.imgur.com/T9ACLM2.png", "https://i.imgur.com/T9ACLM2.png")
                        .setDescription("Below you'll find a permanent invite link.\nMake sure to spread this Discord far and wide " + ralsei_happy)
                        .setThumbnail("https://i.imgur.com/srbLBo1.png")
                        .setColor(0x7289DA)
                        
                        receivedMessage.channel.send({embed: InviteEmbed}).then(msg => {
                          messages.push(msg)
                          
                          receivedMessage.channel.send("https://discord.gg/sn58NPt")
                        })
                      })
                    })
                  })
                })
              })
          })
      })

  }
}




