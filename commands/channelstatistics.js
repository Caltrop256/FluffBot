const Discord = require('discord.js');
const smartTruncate = require('smart-truncate');
const prettyMs = require('pretty-ms');
const rgbHex = require('rgb-hex');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'channelstatistics',
    aliases: ['cstats'],
    description: 'Displays a multitude of facts and statistics about a Channel',
    args: true,
    usage: '<channel>',
    guildOnly: true,
    rateLimit: {
        usages: 3,
        duration: 60,
        maxUsers: 2
    },
    permLevel: 1, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

execute(client, arguments, receivedMessage) {

        var specifiedChannel;

        if(!arguments[0]) {return receivedMessage.reply("Please specify a Channel.")}
        if(arguments && isNaN(arguments[0])) {var specifiedChannel = receivedMessage.mentions.channels.first()}
        if(arguments && !isNaN(arguments[0])) {var specifiedChannel = client.channels.get(arguments[0]);}

        var limit = arguments[1]
        if(!limit) {var limit = Infinity}
        if(isNaN(limit)) {return receivedMessage.reply("The limit must be a number.")}

        messageFetcher3000(specifiedChannel, limit)

        async function messageFetcher3000(specifiedChannel, limit) {
            var hrstart = process.hrtime()
                
            receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Collecting Data").setDescription("Please be patient...").setColor(embedPerfect_Orange))

            const sum_messages = [];
            let last_id;
        
            while (true) {
                const options = { limit: 100, before: receivedMessage.id};
                if (last_id) {
                    options.before = last_id;
                }
        
                const messages = await specifiedChannel.fetchMessages(options);
                sum_messages.push(...messages.array());
                last_id = messages.last().id;
        
                if (messages.size != 100) {
                    break;
                }
                if(sum_messages.length > limit) {
                    break;
                }
            }
            console.log(sum_messages.length)

            let HumanMessages = sum_messages.filter(msg => !msg.author.bot)

            var timestampArray = []
            var timestampArrayB = []

            var LengthArray = []
            var MemberArray = []

            var memberAccountAgeArray = []
            var memberjoinedDateArray = []

            var uncleanImagesArray = []

            sum_messages.forEach(m => {
                timestampArray.push(m.createdTimestamp)
                timestampArrayB.push(m.createdTimestamp)

                LengthArray.push(m.content.length)

                if(m.member !== null) {
                MemberArray.push(m.member)
                memberAccountAgeArray.push(m.member.user.createdTimestamp)
                memberjoinedDateArray.push(m.member.joinedTimestamp)


                const embeds = m.embeds;
                const attachments = m.attachments; 

                let eURL = ''

                if (embeds.length > 0) {

                if(embeds[0].thumbnail && embeds[0].thumbnail.url)
                    eURL = embeds[0].thumbnail.url;
                else if(embeds[0].image && embeds[0].image.url)
                    eURL = embeds[0].image.url;
                else
                    eURL = embeds[0].url;

                } else if (attachments.array().length > 0) {
                const attARR = attachments.array();
                eURL = attARR[0].url;
                }

                uncleanImagesArray.push(eURL)
                }
            })

            var UniqueMemberArray = MemberArray.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
            })

            var ImagesArray = uncleanImagesArray.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
            })
                
            timestampArrayB.shift()
            var timestampArrayReduced = []

            for(var i = 0;i<=timestampArrayB.length-1;i++) {
            timestampArrayReduced.push(timestampArray[i] - timestampArrayB[i]);
            }

            const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    
            const averagemessageDelay = average(timestampArrayReduced);

            var firstMessage = sum_messages[0]

            var NoActivitySince = receivedMessage.createdTimestamp - firstMessage.createdTimestamp

            if(NoActivitySince < 0) {var NoActivitySince = 1}

            const evaluationNumber = 60000

            var lastmsgmultiplier = NoActivitySince / 60000
            var msgDelaymultiplier = averagemessageDelay / 60000

            var verdictNumber = ((lastmsgmultiplier * evaluationNumber) + (msgDelaymultiplier * evaluationNumber)) / 2

            verdictNumMultiplier = verdictNumber / 60000
            var verdictNumFinal = verdictNumMultiplier / 2.5

            var r = (verdictNumMultiplier / 2 * 255)
            var g = (2 / verdictNumMultiplier * 255)

            if(r > 255) {var r = 255}
            if(g > 255) {var g = 255}

            var verdict;
            var verdictColor = `0x${rgbHex(r, g, 0)}`
            
            var averageLength = average(LengthArray)

            var accountAgeAverage = average(memberAccountAgeArray)
            var accountJoinaverage = average(memberjoinedDateArray)

            var accountAgeString = `${prettyMs(receivedMessage.createdTimestamp - accountAgeAverage, {verbose: true, compact: false})}`

            hrend = process.hrtime(hrstart)

            function numComma(x) {
                var parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");
            }

            var DataEmbed = new Discord.RichEmbed()
            .setAuthor(`Requested by ${receivedMessage.member.displayName}`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
            .setTitle(`#${specifiedChannel.name} statistics`)
            .setDescription(`Below you will find a bunch of Information and statistics regarding the ${specifiedChannel} channel.\n[Latest Message from ${specifiedChannel.name}](https://discordapp.com/channels/${specifiedChannel.guild.id}/${specifiedChannel.id}/${specifiedChannel.lastMessageID})\n[Random Image from ${specifiedChannel.name}](${ImagesArray[Math.floor(Math.random() * ImagesArray.length)]})\n\n**Enjoy!**`)
            .setColor(verdictColor)
            .setThumbnail(specifiedChannel.guild.iconURL)
            .setTimestamp()
            .setFooter(`Searched through ${sum_messages.length} messages in ${hrend[0]} seconds and ${prettyMs(hrend[1] / 1000000, {formatSubMilliseconds: false, verbose: true})}`)
            .addField(`General Information`,`ID: \`${specifiedChannel.id}\`\n Position: \`${specifiedChannel.calculatedPosition + 1}\`\nEligible to View: \`${numComma(specifiedChannel.members.size)} members\`\nNSFW: \`${specifiedChannel.nsfw}\`\nCategory: \`${specifiedChannel.parent.name.toString().replace(/[^A-Za-z0-9]+/g, '')}\`\nPeople typing: \`${specifiedChannel.typingCount}\` `,true)
            .addField(`Activity Statistics`, `Total Messages: \`${numComma(sum_messages.length)}\`\n Human Messages: \`${numComma(HumanMessages.length)}\`\nBot Messages: \`${numComma(sum_messages.length - HumanMessages.length)}\`\nLast Message sent: \`${prettyMs(NoActivitySince, {verbose: true, compact: true})} ago\`\nAverage Delay: \`${prettyMs(averagemessageDelay, {verbose: true, compact: true})}\`\nDeathliness: \`${numComma(verdictNumFinal.toFixed(2))}\` `,true)
            .addField(`Message Statistics`, `Average Length: \`${numComma(averageLength.toFixed(1))} chars\`\nUnique Participants: \`${numComma(UniqueMemberArray.length)}\`\nAmount of Images: \`${numComma(ImagesArray.length - 1)}\` `,true)
            .addField(`User Statistics`, `Average Join Date: \`${prettyMs(receivedMessage.createdTimestamp - accountJoinaverage, {verbose: true, compact: true})} ago\`\nAverage User Age: \`${accountAgeString.match(/.+?(?=(days \d))/gi)} days\` `,true)

            receivedMessage.channel.send({embed: DataEmbed})
        }
        
    }
}