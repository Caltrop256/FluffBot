const Discord = require('discord.js');
const fs = require('fs');
const Canvas = require('canvas');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'instantregretrunningthis',
    aliases: ['karmafixer', 'irrt'],
    description: 'kill me',
    args: true,
    usage: '<#channel>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

async execute(client, arguments, receivedMessage) {

    /*
    Channels:
    #announcements
    #suggestions-and-feedback

    #nsfw
    #castle-town (kill me)
    #art
    #memes

    #off-topic
    #off-topic-old
    #bot-commands
    #venting

    #gaming
    #music
    #movies
    #food

    #vc-and-music-bot

    #hideout

    */

        var specifiedChannel;

        if(!arguments[0]) {return receivedMessage.reply("Please specify a Channel.")}
        if(arguments && isNaN(arguments[0])) {var specifiedChannel = receivedMessage.mentions.channels.first()}
        if(arguments && !isNaN(arguments[0])) {var specifiedChannel = client.channels.get(arguments[0]);}

        var limit = arguments[2] ? parseInt(arguments[2]) : Infinity
        var expectedMessages = arguments[1] ? parseInt(arguments[1]) : 0
        var beforeMessageID = arguments[3] ? arguments[3] : receivedMessage.id
        if(limit < Infinity) expectedMessages = limit
        messageFetcher3000(specifiedChannel, limit)

        async function messageFetcher3000(specifiedChannel, limit) {
            var hrstart = process.hrtime()
                
            receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Collecting Data").setDescription("Please be patient...").setColor(embedPerfect_Orange))

            const sum_messages = [];
            let last_id;
        
            while (true) {
                const options = { limit: 100, before: beforeMessageID};
                if (last_id) {
                    options.before = last_id;
                }
        
                const messages = await specifiedChannel.fetchMessages(options);
                sum_messages.push(...messages.array());
                last_id = messages.last().id;

                console.log(`Fetched ${sum_messages.length}/${expectedMessages} messages\n${(sum_messages.length / expectedMessages * 100).toFixed(1)}% done!`)
        
                if (messages.size != 100) {
                    break;
                }
                if(sum_messages.length > limit) {
                    break;
                }
            }
            console.log(sum_messages.length)

            receivedMessage.channel.send(sum_messages[sum_messages.length-1].id)

            var iwantdie = new Discord.Collection()
            sum_messages.forEach(msg => {
                if(msg.author) {
                    var up = 0;
                    var down = 0;
                    msg.reactions.forEach(r => {
                        switch(r.emoji.id) {
                            case "562330233315917843" :
                                up = r.count
                                break;
                            case "562330227322388485" :
                                down = r.count
                                break;
                        }
                    })
                    var user = iwantdie.get(msg.author.id)
                    if(user) {
                        var uUp = user.up
                        var uDown = user.down
                        iwantdie.set(msg.author.id, {up: uUp + up, down: uDown + down, id: msg.author.id})
                    } else {
                        iwantdie.set(msg.author.id, {up: up, down: down, id: msg.author.id})
                    }
                }
            })
            iwantdie.forEach(votes => {
                var existing = client.userKarma.get(votes.id)
                if(existing) {
                    client.userKarma.set(votes.id, {id: votes.id, up: existing.up + votes.up, down: existing.down + votes.down, plat: existing.plat, gold: existing.gold, silver: existing.silver})
                } else {
                    client.userKarma.set(votes.id, {id: votes.id, up: votes.up, down: votes.down, plat: 0, gold: 0, silver: 0})
                }
            })
            console.log(iwantdie)
        }
    }
}