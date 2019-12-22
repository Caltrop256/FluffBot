'use strict';

const smartTruncate = require('smart-truncate');



module.exports = {
    name: 'randomquote',
    aliases: ['quote', 'msg'],
    description: 'Displays a random quote from the specified user',
    args: false,
    usage: '<@user> <#channel> <minimum Length> <limit> <before message id>',
    advUsage: 'The command will automatically default to the following Options:\n`<Any User> <current channel> <-1> <7000> <this message>`\n\n**Here is what the individual options do:**\n`Minimum Length` is the minimum amount of characters that the quote should have.\n\n`Limit` is how many total messages will be searched through, making this number higher will allow a greater diversity in Quotes but will also make the Data Collection Process take longer.\n\n`Before Message ID` is used to tell the bot in which time period to fetch messages, if you provide a Message ID it will only fetch messages after that Message was sent.\n\n__**Example for getting a randomquote from #castle-town which was sent by Caltrop on the 1st of April and includes a minimum of 100 Characters**__:\n--prefcmd <@!214298654863917059> <#562324876837388294> 100 50000 562395738458554431',
    guildOnly: true,
    rateLimit: {
        usages: 3,
        duration: 60,
        maxUsers: 3
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

async execute(client, args, message) {

        var randMember = "any"
        var randChannel = client.channels.random()

        var channel = message.mentions.channels.first() || message.channel

        var member = message.mentions.members.first()
        
        if(!member) {
            var letterMatch = args.join(" ").match(/\b[\-a-zA-Z]+\b/gi)
            if(letterMatch !== null) member = client.getMember(letterMatch.join(), message.guild, message.member)
        }
        var quoteUser = member ? member.user.id : randMember

        var numberMatch = args.join(" ").match(/(?<=( |^))[0-9]+/gi)
        if(numberMatch != null) {
            if(numberMatch[0]) {
                var minimumLength = numberMatch[0] && numberMatch[0] < 1500 ? parseInt(numberMatch[0]) : -1
                if(numberMatch[1]) {
                    var limit = numberMatch[1] && numberMatch[1] <= 50001 ? parseInt(numberMatch[1]) : 7000
                    if(numberMatch[2]) {
                        var beforeMessageID = numberMatch[2] ? numberMatch[2] : message.id
                        var beforeMessage = await channel.fetchMessage(beforeMessageId)
                        if(!beforeMessage) return message.reply(`\`${beforeMessageID}\` isn't a valid Message ID.`)
                    } else  var beforeMessageID = message.id
                } else var limit = 7000
            } else var minimumLength = -1
        } else {var minimumLength = -1; var limit = 7000; var beforeMessageID = message.id}

        console.log(minimumLength, limit, beforeMessageID)
        
        var forbiddenChannels = ['562328446445944872', '575985149368467466', '562338340918001684', '562328726738567168', '562338454395027469', '571770555343175719']

        for (var i = 0; i < forbiddenChannels.length; i++) {
            if(channel.id.includes(forbiddenChannels[i])) {
                return message.reply("Nice try.")
            }
        }

        lots_of_messages_getter(channel, limit)

        async function lots_of_messages_getter(channel, limit) {
            var hrstart = process.hrtime()

            var updateAmt = 15
            if(updateAmt * 100 > limit) updateAmt = limit / 100

            var ogFactor = Math.floor(limit / updateAmt)
            var Factor = ogFactor
            var cycles = 0

            var updbar = ""
            
            message.channel.send(client.scripts.getEmbed().setAuthor("Collecting Data\n").setDescription(`Please be patient...\n\`0%\` done\n\`\`\`\n[${updbar.padEnd(updateAmt, ".")}]\`\`\`\nETA: \`calculating\``).setColor(client.constants.perfectOrange.hex)).then(async message => {
                const sum_messages = [];
                let last_id;
                var start = Date.now()
                while (true) {
                    const options = { limit: 100, before: beforeMessageID};
                    if (last_id) {
                        options.before = last_id;
                    }
            
                    const messages = await channel.fetchMessages(options);
                    sum_messages.push(...messages.array());
                    last_id = messages.last().id;
            
                    if (messages.size != 100) {
                        break;
                    }
                    if(sum_messages.length >= Factor) {
                        cycles++
                        Factor += ogFactor
                        updbar += "="
                        message.edit(client.scripts.getEmbed().setAuthor(`Collecting Data`).setDescription(`Please be patient...\n\`${Math.round(sum_messages.length / limit * 100, 1)}%\` done\n\`\`\`\n[${updbar.padEnd(updateAmt, ".")}]\`\`\`\nETA: \`${client.time((Date.now() / cycles - start / cycles) * (updateAmt - cycles),true)}\``).setColor(client.constants.perfectOrange.hex))
                    }
                    if(sum_messages.length >= limit) {
                        break;
                    }
                }
                if(!quoteUser.includes("any")){var filteredMessages = sum_messages.filter(msg => msg.author.id == quoteUser).filter(msg => msg.content.length > minimumLength)}
                else{var filteredMessages = sum_messages.filter(msg => msg.content.length > minimumLength)}
                if(filteredMessages.length < 1) {return message.reply("There were no messages which matched your criteria.\n" + `User: \`${quoteUser}\`, Channel: \`${channel.name}\`, Minimun Length: \`${minimumLength}\`, Limit: \`${limit}\`, Before Message: \`${beforeMessageID}\``)}
                let randomMessage = filteredMessages[Math.floor(Math.random() * filteredMessages.length)]

                var messageLink = `https://discordapp.com/channels/${randomMessage.guild.id}/${randomMessage.channel.id}/${randomMessage.id}`

                const embeds = randomMessage.embeds;
                const attachments = randomMessage.attachments; 

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
                

                var hrend = process.hrtime(hrstart)
                

                message.edit(client.scripts.getEmbed().setAuthor(`Collecting Data`).setDescription(`**Finished!**`).setColor(client.constants.perfectOrange.hex).setFooter(`Searched through ${sum_messages.length} messages in ${hrend[0]} seconds and ${client.time(hrend[1] / 1000000,true)}\n(Found ${filteredMessages.length} total matches)`))

                var messageinfoEmbed = client.scripts.getEmbed()
                .setAuthor(randomMessage.author.tag, randomMessage.author.displayAvatarURL)
                .setThumbnail(randomMessage.member.user.avatarURL)
                .setDescription(`\[[Jump to message](${messageLink})]`)
                .addField("Content", `${smartTruncate(randomMessage.content, 2000)||"`No Message`"}`)
                .setColor(message.member.displayHexColor)
                .setImage(eURL)
                .setFooter(`ID: ${randomMessage.id}`)

                message.channel.send({embed: messageinfoEmbed})
            })
        }  

    }
}


