'use strict';
// ready
/* Emitted when the client becomes ready to start working.    */
const emojiIDs = ['562330233315917843', '562330227322388485', '586161821338042379', '586161821551951882', '586161821044441088'];
module.exports = {
    execute(client) {
        (async() => {
            var starboardChannel = client.channels.get(client.cfg.starboardChannel);
            var options = { limit: 100};
            var before, messages;
            var totalMessages = []
            do {
                if(before)
                    options.before= before;
                messages = await starboardChannel.fetchMessages(options);
                totalMessages.push(...messages.array());
                before = messages.last().id;
                console.log(messages.size,before);
            } while (messages.size === 100)
            // var badEggs = [];
            var uniqueEggs  = [];
            console.log(totalMessages.length);
            var goodEggs = totalMessages.filter(x => x.author.id === client.user.id).map(x => [x.embeds[0].description.match(/([0-9]+)\)\]/)[1],x]).filter(x =>{
                //if(!/https:\/\/tropbot\.cheeseboye\.com\/images\/([0-9]+?)_([0-9]+?).png/i.test(x[1].embeds[0].thumbnail.url)) return false; will be uncommented a few weeks after release 
                if(uniqueEggs.includes(x[0])) return false;//!badEggs.push(x);
                return uniqueEggs.push(x[0]);
            })
            client.starboardCollection = client.scripts.getCollection(goodEggs);
            client.isStarboardReady = true;
        })()


    }
};