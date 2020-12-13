// messageDelete
/* Emitted whenever a message is deleted.
PARAMETER      TYPE           DESCRIPTION
message        Message        The deleted message    */

module.exports = {
  async execute(client, message)
  {
    if (message.channel.type != 'text') return;
    const entry = (await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' })).entries.first()
    let user = {}
    if (entry && (entry.extra.channel.id === message.channel.id
      && (entry.target.id === message.author.id)
      && (entry.createdTimestamp > (Date.now() - 5000))
      && (entry.extra.count >= 1)))
    {
      user = entry.executor
    } else
    {
      user = message.author
    }
    const embeds = message.embeds;
    const attachments = message.attachments;
    let eURL = ''
    if (embeds.length > 0)
    {
      if (embeds[0].thumbnail && embeds[0].thumbnail.url)
        eURL = embeds[0].thumbnail.url;
      else if (embeds[0].image && embeds[0].image.url)
        eURL = embeds[0].image.url;
      else
        eURL = embeds[0].url;
    } else if (attachments.array().length > 0)
    {
      const attARR = attachments.array();
      eURL = attARR[0].url;
    }

    var footer = entry.reason ? `ID: ${message.author.id}, Reason: ${entry.reason}` : `ID: ${message.author.id}`
    var Embed = client.scripts.getEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setTimestamp()
      .setColor(0xFC4B4B)
      .setFooter(footer)
      .setImage(eURL)
    if (user !== message.author) { Embed.setDescription(`**A message sent by ${message.author} was deleted by ${user} in ${message.channel}**[Jump to Message](${message.url})\n${message.content}`) }
    else Embed.setDescription(`**${message.author} deleted their own message in ${message.channel}**[Jump to Message](${message.url})\n${message.content}`)

    if (user == message.author) client.lastSeen(user, `Deleted their own message in #${message.channel.name}`)

    const logs = client.channels.get(client.cfg.logChannel)

    logs.send({ embed: Embed })
  }
}