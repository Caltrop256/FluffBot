const Discord = require('discord.js');

module.exports = {
    name: 'boosters',
    aliases: ['booster', 'nitrobooster'],
    description: 'Displays who has nitro boosted our Discord',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: 1,
        duration: 20,
        maxUsers: 2
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   async execute(client, arguments, receivedMessage) {
        var BoosterRole = await receivedMessage.guild.roles.get("585534616249565200")

        var BoosterArray = []

        await BoosterRole.members.forEach(m => {
            BoosterArray.push(m)
        })

        var BoosterLevel = 0;
        var BoosterText = ``
        if(BoosterArray.length >= 2) {var BoosterLevel = 1; BoosterText = BoosterText + `-100 extra emoji slots\n-an Animated Server Icon\n-a custom server splash background\n`}
        if(BoosterArray.length >= 10) {var BoosterLevel = 2;  BoosterText = BoosterText + `-100 *more* extra emoji slots\n-a custom server banner\n-50mb upload limit for all members\n`}
        if(BoosterArray.length >= 50) {var BoosterLevel = 3;  BoosterText = BoosterText + `-200 extra emoji slots\n-a vanity url\n`}

        var boosterembed = new Discord.RichEmbed()
        .setAuthor(`Thanks to the ${BoosterArray.length} people who have Boosted us!`, receivedMessage.guild.iconURL.replace(/jpg$/g, "gif"), receivedMessage.guild.iconURL.replace(/jpg$/g, "gif"))
        .setDescription(`${BoosterArray.join(", ").replace(/, ([^,]*)$/, ' and $1')} are exceedingly cool people!`)
        .setColor(embedNeon_Green)
        .setThumbnail(receivedMessage.guild.iconURL.replace(/jpg$/g, "gif"))
        .addField(`Booster Level ${BoosterLevel}`, `Due to the very kind Donation of the above mentioned people we now have:\n**${BoosterText}**`)
        .setFooter("Thank you very much <3")

        receivedMessage.channel.send({embed: boosterembed})
   }
}

const embedNeon_Green = 0x1DFF2D