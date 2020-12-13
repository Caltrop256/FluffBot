module.exports = {
    name: 'ischatdead',
    aliases: ['ischatdead?', 'ripchat'],
    description: 'Displays when the last Message was sent',
    args: false,
    usage: '<#channel>',
    rateLimit: {
        usages: 1,
        duration: 20,
        maxUsers: 3
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message)
    {

        /*client.muteUser(client, message.member.id, client.user.id, Infinity, Date.now(), message.guild, false, null);
        lol i wish*/

        var DebugMode = 0;

        if (message.content.toString().includes("-d")) { var DebugMode = 1 }

        var channel = client.getChannel(args[0], message.channel)
        if (!channel) return message.reply("Couldn't find the channel")

        channel.fetchMessages({ limit: 20 }).then(messages =>
        {
            if (messages.size < 2) return message.reply("The channel must include at least 2 messages")
            let filteredMessage = messages.filter(msg => !msg.content.toLowerCase().includes("ischatdead")).filter(msg => !msg.author.bot)

            var timestampArray = []
            var timestampArrayB = []

            messages.forEach(m =>
            {
                timestampArray.push(m.createdTimestamp)
                timestampArrayB.push(m.createdTimestamp)
            })

            timestampArrayB.shift()
            var timestampArrayReduced = []

            for (var i = 0; i <= timestampArrayB.length - 1; i++)
            {
                timestampArrayReduced.push(timestampArray[i] - timestampArrayB[i]);
            }

            const result = client.scripts.average(timestampArrayReduced);

            var firstMessage = filteredMessage.first()

            if (!firstMessage) { return message.reply("I could not locate any Human activity in " + channel) }

            var NoActivitySince = message.createdTimestamp - firstMessage.createdTimestamp
            var LastChannel = firstMessage.channel
            var LastUser = firstMessage.author

            if (NoActivitySince < 0) { var NoActivitySince = 1 }

            const evaluationNumber = 60000

            var lastmsgmultiplier = NoActivitySince / 60000
            var msgDelaymultiplier = result / 60000

            var verdictNumber = ((lastmsgmultiplier * evaluationNumber) + (msgDelaymultiplier * evaluationNumber)) / 2

            verdictNumMultiplier = verdictNumber / 60000
            var verdictNumFinal = verdictNumMultiplier / 2.5

            var r = (verdictNumMultiplier / 2 * 255)
            var g = (2 / verdictNumMultiplier * 255)

            if (r > 255) { var r = 255 }
            if (g > 255) { var g = 255 }

            var verdict;
            var verdictColor = client.scripts.rgbToHex([Math.round(r), Math.round(g), 0])

            var verdict = verdictNumFinal >= 1 ? 'Dead' : 'Not Dead'
            if (verdictNumFinal < 0.05) { verdict = "No, Dummy"; var verdictColor = 0x000000 }

            var ischatdeadEmbed = client.scripts.getEmbed()
                .setColor(verdictColor)
                .setTitle("Is Chat dead?")
                .setDescription(`The last message in ${LastChannel} was sent \`${client.time(NoActivitySince, true)}\` ago by ${LastUser} with an average of \`${client.time(result, true)}\` between messages.`)
                .addField("Verdict:", verdict)
                .setFooter(`deathliness: ${verdictNumFinal.toFixed(2)}`)
                .setTimestamp();
            if (DebugMode == 1) { ischatdeadEmbed.addField("Debug Information", `lastmsgmultiplier: \`${lastmsgmultiplier}\`\nmsgDelaymultiplier: \`${msgDelaymultiplier}\`\nverdictNumMultiplier: \`${verdictNumMultiplier}\`\nverdictNumFinal: \`${verdictNumFinal}\`\nRGB: \`${r}, ${g}, 0\`\nHEX: ${verdictColor}`) }

            message.channel.send({ embed: ischatdeadEmbed })


        });

    }
};