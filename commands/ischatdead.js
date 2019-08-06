const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const prettyMs = require('pretty-ms');
const rgbHex = require('rgb-hex');

const embedGreen = 0x74B979
const embedRed = 0xFC4B4B




module.exports = {
    name: 'ischatdead',
    aliases: ['ischatdead?', 'ripchat'],
    description: 'Displays when the last Message was sent',
    args: false,
    usage: '<#channel>',
    guildOnly: false,
    rateLimit: {
        usages: 1,
        duration: 20,
        maxUsers: 3
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

            var DebugMode = 0;

            if(receivedMessage.content.toString().includes("-d")) {var DebugMode = 1}

            var channel = client.getChannelFromArg(receivedMessage, arguments, 0)
            if(!channel) return receivedMessage.reply("Couldn't find the channel")

            channel.fetchMessages({ limit: 20 }).then(messages => {
                let filteredMessage = messages.filter(msg => !msg.content.toLowerCase().includes("ischatdead")).filter(msg => !msg.author.bot)

                var timestampArray = []
                var timestampArrayB = []

                messages.forEach(m => {
                    timestampArray.push(m.createdTimestamp)
                    timestampArrayB.push(m.createdTimestamp)
                })
                
                timestampArrayB.shift()
                var timestampArrayReduced = []

                for(var i = 0;i<=timestampArrayB.length-1;i++) {
                timestampArrayReduced.push(timestampArray[i] - timestampArrayB[i]);
                }

                const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    
                const result = average(timestampArrayReduced);


                var firstMessage = filteredMessage.first()

                if(!firstMessage) {return receivedMessage.reply("I could not locate any Human activity in " + channel)}

                var NoActivitySince = receivedMessage.createdTimestamp - firstMessage.createdTimestamp
                var LastChannel = firstMessage.channel
                var LastUser = firstMessage.author

                if(NoActivitySince < 0) {var NoActivitySince = 1}

                const evaluationNumber = 60000

                var lastmsgmultiplier = NoActivitySince / 60000
                var msgDelaymultiplier = result / 60000

                var verdictNumber = ((lastmsgmultiplier * evaluationNumber) + (msgDelaymultiplier * evaluationNumber)) / 2

                verdictNumMultiplier = verdictNumber / 60000
                var verdictNumFinal = verdictNumMultiplier / 2.5

                var r = (verdictNumMultiplier / 2 * 255)
                var g = (2 / verdictNumMultiplier * 255)

                if(r > 255) {var r = 255}
                if(g > 255) {var g = 255}

                var verdict;
                var verdictColor = `0x${rgbHex(r, g, 0)}`

                var verdict = verdictNumFinal >= 1 ? 'Dead' : 'Not Dead'
                if(verdictNumFinal < 0.05) {verdict = "No, Dummy"; var verdictColor = 0x000000}

                var ischatdeadEmbed = new Discord.RichEmbed()
                .setColor(verdictColor)
                .setTitle("Is Chat dead?")
                .setDescription(`The last message in ${LastChannel} was sent \`${prettyMs(NoActivitySince, {verbose: true, compact: true})}\` ago by ${LastUser} with an average of \`${prettyMs(result, {verbose: true, compact: true})}\` between messages.`)
                .addField("Verdict:", verdict)
                .setFooter(`deathliness: ${verdictNumFinal.toFixed(2)}`)
                .setTimestamp();
                if(DebugMode == 1) {ischatdeadEmbed.addField("Debug Information", `lastmsgmultiplier: \`${lastmsgmultiplier}\`\nmsgDelaymultiplier: \`${msgDelaymultiplier}\`\nverdictNumMultiplier: \`${verdictNumMultiplier}\`\nverdictNumFinal: \`${verdictNumFinal}\`\nRGB: \`${r}, ${g}, 0\``)}

                receivedMessage.channel.send({embed: ischatdeadEmbed})


            });
     
        }
}