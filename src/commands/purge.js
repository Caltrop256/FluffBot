const Discord = require('discord.js');
const smartTruncate = require('smart-truncate');
const prettyMs = require('pretty-ms');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'purge',
    aliases: ['pr', 'remove', 'delete'],
    description: 'Purges messages from a channel',
    args: true,
    usage: '<amount of messages> <params>',
    advUsage: '**Parameters**:\n\n`-h` - only human messages\n`-b` - only bot messages\n`-a` - only messages including one or more attachments (for example images or audio files)\n`-e` - only messages including one or more embeds (for example auto-embeded links or RichEmbeds)\n`-t` - only messages including text (ignores all attachments and embeds)\n`-l` - only messages including one or more links\n\n**Additionally you can also wrap a phrase in quotes to target only messages including that phrase.**\nExample `--prefcmd "free porn lol" -l` will delete all messages which contain the phrase "free porn lol" and also contain one or more link\nIt will target regardless of capitalisation\n\n**To target individual Users mention them anywhere in the message**:\n`--prefcmd 20 @Caltrop#0001 @Clod#0705` will delete all messages sent by either Caltrop or Clod in the latest 20 messages of a channel.    ',
    guildOnly: true,
    rateLimit: {
        usages: 5,
        duration: 60,
        maxUsers: 3
    },
    permLevel: 1, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

execute(client, arguments, receivedMessage) {

        var limit = parseInt(arguments[0])
        if(!limit || isNaN(limit) || limit > 10000 || limit < 2) return receivedMessage.reply("The limit must be a Number between 2 and 10000.")


        lots_of_messages_getter(receivedMessage.channel, limit)

        async function lots_of_messages_getter(channel, limit) {
            var hrstart = process.hrtime()

            var sum_messages = [];
            let last_id;
        
            while (true) {
                const options = { limit: 100 };
                if (last_id) {
                    options.before = last_id;
                } else options.before = receivedMessage.id
        
                const messages = await channel.fetchMessages(options);
                sum_messages.push(...messages.array());
                last_id = messages.last().id;
        
                if (messages.size != 100) {
                    break;
                }
                if(sum_messages.length >= limit) {
                    break;
                }
            }
            var params = ''

            if(sum_messages.length > limit) sum_messages.length = limit
            var sumMessages_Length = sum_messages.length

            var toBeFiltered = sum_messages

            var mentionIndex = 0
            var mentionFilterInput = ''
            receivedMessage.mentions.users.forEach(u => {
                if(mentionIndex == 0) {mentionFilterInput += `msg.author.id == ${u.id}`; params = params + `Messages must be sent by user ${u}\n`}
                else {mentionFilterInput += ` || msg.author.id == ${u.id}`; params = params + `or by user ${u}\n`}
                mentionIndex++
            })
            if(receivedMessage.mentions.users.size > 0) eval(`toBeFiltered = toBeFiltered.filter(msg => ${mentionFilterInput})`)
            //if(receivedMessage.mentions.users.size >= 1) {toBeFiltered = toBeFiltered.filter(msg => msg.author.id == receivedMessage.mentions.users.first().id); params = params + `Only messages sent by ${receivedMessage.mentions.users.first()}\n`}
            if(receivedMessage.content.includes("-h")) {toBeFiltered = toBeFiltered.filter(msg => !msg.author.bot); params = params + `Only Human messages\n`}
            if(receivedMessage.content.includes("-b")) {toBeFiltered = toBeFiltered.filter(msg => msg.author.bot); params = params + `Only Bot messages\n`}
            if(receivedMessage.content.includes("-a")) {toBeFiltered = toBeFiltered.filter(msg => msg.attachments.array().length > 0); params = params + `Only messages including attachments\n`}
            if(receivedMessage.content.includes("-e")) {toBeFiltered = toBeFiltered.filter(msg => msg.embeds.length > 0); params = params + `Only messages including embeds\n`}
            if(receivedMessage.content.includes("-t")) {toBeFiltered = toBeFiltered.filter(msg => msg.content.length > 0); params = params + `Only messages including text (ignores embeds or attachments)\n`}

            var includesFilter = receivedMessage.content.toString().match(new RegExp(/(?<=").*(?=")/ig)); 
            if(includesFilter !== null) {
                toBeFiltered = toBeFiltered.filter(msg => msg.content.toLowerCase().includes(includesFilter[0].toLowerCase())); params = params + `Only messages including "\`${includesFilter[0]}\`" \n`
            }

            if(receivedMessage.content.includes("-l")) {
                toBeFiltered = toBeFiltered.filter(msg => msg.content.match(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/ig));
                params = params + `Only messages including links\n`
            }

            var filteredMessages = toBeFiltered
            console.log(sum_messages.length)
            console.log(filteredMessages.length)
            var filteredMessagesLength = filteredMessages.length

            var step = 0

            while (filteredMessages.length > 0) {
                chunk = filteredMessages.splice(0, 100)
    
                if(chunk.length >= 2 && chunk.length <= 100) {
                    step = step + 1
                    receivedMessage.channel.bulkDelete(chunk).then(messages => {
                        console.log(messages.size)
                    })
                }
            }
            var purgeEmbed = new Discord.RichEmbed()
            .setAuthor(`${filteredMessagesLength} messages deleted in #${receivedMessage.channel.name}`)
            .setDescription(`Deleted \`${filteredMessagesLength}\` messages out of \`${sumMessages_Length}\` fetched Messages (\`${filteredMessagesLength / sumMessages_Length * 100}%\`) in \`${step}\` steps.`)
            .setTimestamp()
            .setColor(embedPerfect_Orange)
            if(params !== "") purgeEmbed.addField("Parameters", params)


            receivedMessage.author.send({embed: purgeEmbed})

            if(filteredMessagesLength > 10) {
                receivedMessage.channel.setRateLimitPerUser(10)
                setTimeout(() => {
                    receivedMessage.channel.setRateLimitPerUser(0)
                }, filteredMessagesLength * 1000);
            }
        }
    }
}


