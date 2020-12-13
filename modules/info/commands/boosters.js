'use strict'
module.exports = {
    name: 'boosters',
    aliases: ['booster', 'nitrobooster'],
    description: 'Displays who has nitro boosted our Discord',
    args: false,
    usage: '',
    rateLimit: {
        usages: 1,
        duration: 20,
        maxUsers: 2
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    async execute(client, args, message)
    {
        var BoosterRole = await message.guild.roles.find(r => r.name == "Nitro Booster")

        var BoosterArray = []

        await BoosterRole.members.forEach(m =>
        {
            BoosterArray.push(m)
        })
        var ServerFeatures = message.guild.features;
        var BoosterLevel = 0;
        var BoosterText = ``
        if (ServerFeatures.includes('VANITY_URL')) { var BoosterLevel = 3; BoosterText = BoosterText + `-200 extra emoji slots\n-a vanity url\n` }
        else if (ServerFeatures.includes('BANNER')) { var BoosterLevel = 2; BoosterText = BoosterText + `-100 *more* extra emoji slots\n-a custom server banner\n-50mb upload limit for all members\n` }
        else if (ServerFeatures.includes('ANIMATED_ICON')) { var BoosterLevel = 1; BoosterText = BoosterText + `-100 extra emoji slots\n-an Animated Server Icon\n-a custom server splash background\n` }

        var boosterembed = client.scripts.getEmbed()
            .setAuthor(`Thanks to the ${BoosterArray.length} people who have Boosted us!`, message.guild.iconURL.replace(/jpg$/g, "gif"), message.guild.iconURL.replace(/jpg$/g, "gif"))
            .setDescription(`${BoosterArray.join(", ").replace(/, ([^,]*)$/, ' and $1')} are exceedingly cool people!`)
            .setColor(client.constants.green.hex)
            .setThumbnail(message.guild.iconURL.replace(/jpg$/g, "gif"))
            .addField(`Booster Level ${BoosterLevel}`, `Due to the very kind Donation of the above mentioned people we now have:\n**${BoosterText}**`)
            .setFooter("Thank you very much <3")

        message.channel.send({ embed: boosterembed })
    }
};