const Discord = require('discord.js');

module.exports = {
    name: 'ruleembed',
    aliases: ['termsembed'],
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
        receivedMessage.channel.send({embed: ruleembed})
        .then(() => receivedMessage.channel.send({embed: ruleembedConfirm}))
        .then(function (message){
            message.react("✅")
        })
    }
}

const embedNeon_Green = 0x1DFF2D

const ruleembedConfirm = new Discord.RichEmbed()
  .setTitle("By clicking on the reaction below you aknowledge the Rules and confirm that you are over the age of 13.")
  .setColor(embedNeon_Green)


const ruleembed = new Discord.RichEmbed()
  .setTitle("Server Rules")
  .setAuthor("/r/fluffyboi", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
  .setColor(embedNeon_Green)
  .setDescription("Please make sure to thoroughly read the Rules.")
  .setFooter("last updated on", "")
  .setImage("")
  .setThumbnail("https://i.imgur.com/T9ACLM2.png")
  .setTimestamp()
  .setURL("https://www.reddit.com/r/fluffyboi/")
  .addField(`Rule 1: Bad Faith Participation And Civility`,
  "Remember that you are talking to another human. Always give the person you are talking to the benefit of the doubt. Avoid `spouting identity-based slurs` and being `abusive`, `abrasive`, `unreasonably offensive`, or `vitriolic`.\n**If you feel like you are unable to keep a conversation civil and respectful then it is best to leave that discussion.**")
  .addField("Rule 2: Privacy",
  "We have a zero-tolerance rule towards doxxing, which includes publishing `phone numbers`, `street addresses`, `names`, `pictures`, `credit card information` or any other identifiable/confidential files. This also includes pressuring people into posting sensitive files. **Any suspicious behavior will result in a permanent ban and your information being forwarded to Discords Trust & Safety Team.**")
  .addField("Rule 3: Disruptive Behavior",
  `Do not try to derail any on-going conversation or discussions. \`Posting unrelated images\`, \`mass or rapid mentioning\`,\`not speaking English\`, \`unnecessary use of caps\`, \`advertisements\`, \`ASCII art\`, \`spoiling the plot of any medium\` or anything else that the **Darkners** deems inappropriate/disruptive will grant you a mute.`)
  .addField("Rule 4: NSFW Content",
  "Posting content which is traditionally called [NSFW](https://www.urbandictionary.com/define.php?term=NSFW) - short for **N**ot **S**afe **F**or **W**ork such as `Porn`, `Gore`, `sexually questionable images` or similar content is not allowed. If you are unsure if your media is allowed please contact the Darkners.\nMature discussions should be avoided outside of [#off-topic](https://discordapp.com/channels/562324876330008576/562327927795089435)")
;