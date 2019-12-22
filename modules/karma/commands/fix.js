'use strict';
var pgsNames = ['redditplatinum', 'redditgold', 'redditsilver']
module.exports = {
    name: 'fix',
    aliases: ['starboard'],
    description: 'Fixes a message if it isn\'t already on starboard but should',
    args: true,
    usage: 'https://discordapp.com/channels/<Guild ID>/<Channel ID>/<Message ID>',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    async execute(client, args, message) {
        if (!client.isStarboardReady) return message.reply('Starboard messages still being cached, please wait')
        try {
            var argMSG = await client.scripts.getMessageFromLink(client, args[0])
        } catch (err) {
            if (err instanceof TypeError)
                return message.reply('Invalid Channel');
            else
                return message.reply('Invalid Message');
        }
        var previousKarma = new client.Karma(0, 0, 0, 0, 0);
        var currentKarma = await client.getMessageKarma(argMSG);
        var userKarma = await client.getUserKarma(argMSG.author.id)
        var karmaDifference = new client.Karma(0, 0, 0, 0, 0);
        var msg = client.starboardCollection.get(argMSG.id);
        if (msg) {

            var embed = msg.embeds[0];
            var urlMatch = embed.thumbnail.url.match(/https:\/\/tropbot\.cheeseboye\.com\/images\/([0-9]+?)_([0-9]+?).png/i); //will be
            if (urlMatch === null) //commented in        
                return message.reply('Unfortunately, the specified message uses a v2 starboard message which is not compatible with the v3 system as it cannot be edited'); //a few weeks
            previousKarma.upvotes = parseInt(urlMatch[1]);
            previousKarma.downvotes = parseInt(urlMatch[2]);

            function extractPGS(str, pgsType){
                var match = str.match(new RegExp(`<:${pgsNames[pgsType]}:([0-9]+?)>x([0-9]+?)$`));
                if (match.length == 3) return parseInt(match[2]);
                return '0';
            };

            if (embed.fields.length == 2) {
                var pgs = embed.fields[1].value.split('\n');
                previousKarma.platinum = parseInt(extractPGS(pgs[0], 0));
                previousKarma.gold = parseInt(extractPGS(pgs[1], 1));
                previousKarma.silver = parseInt(extractPGS(pgs[2], 2));
            }
            karmaDifference = currentKarma.subtract(previousKarma);
            client.setUserKarma(argMSG.id, userKarma.add(karmaDifference));
        }
        client.starboardArrayQueue.push(async() =>{
            var action = msg ? (currentKarma >= client.cfg.minStarboardScore ? 'edit' : 'delet') : client.starboardCollection.get(argMSG.id) ? 'add' : '';
            try{
                 await client.handleStarboard(argMSG, currentKarma,msg)
                 if(action.length)
                    return message.reply(`Successfully ${action}ed the starboard message`)
                message.reply('Message has insufficient karma to be added to starboard');
                }catch(err){
                    console.log(err)
                    message.reply(`Error occurred while ${action}ing starboard message`);
                }
            });

    }
}