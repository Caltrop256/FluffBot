const fs = require('fs')
'use strict';
class KarmaInfo {
    constructor(upvotes, downvotes, platinum, gold, silver) {
        this.upvotes = parseInt(upvotes);
        this.downvotes = parseInt(downvotes); 
        this.platinum =  parseInt(platinum);
        this.gold =  parseInt(gold);
        this.silver = parseInt(silver);
    };
};

module.exports = {
    name: 'channeltest',
    aliases: ['getallmessages'],
    description: 'Gets all messages and puts them in a json file',
    args: true,
    usage: 'a|b',
    rateLimit: {
        usages: 1,
        duration: 1000,
        maxUsers: 2
    },
    perms: ['DEV'], 
   
    async execute(client, args, message) {
        if(args[0] == 'a')
            await this.setFile(client,args,message);
        else if(args[0] == 'b')
            await this.getFile(client,args,message);
        else
            message.channel.send('invalid');
    },
    async getFile(client,args,message){
        fs.readFile(client.root+'/reactStore.json', 'utf8', (err, data) => {
            if(err) console.log('error', err);
            else{
                var authorReacts = client.scripts.getCollection(JSON.parse(data))
                message.channel.send(client.clean(require("util").inspect(authorReacts)), {code:"xl", split: true}); //placeholder
            }
        });
    },
    async setFile(client,args,message) {
        var channel = client.channels.get(args[1]) || message.channel;
        var opts = {before:0,limit:100};
        var messages = {};
        var authorReacts = client.scripts.getCollection();
        var messagesCount = 0;
        do
        {
            messages = await channel.fetchMessages(opts);
            if(!messages.size) 
                break
            for(var [msgID,msg] of messages)
            {   
                
                var author = msg.author;
                var reacts = msg.reactions;
                if((author.username  == 'Deleted User') && (author.discriminator == '0000'))
                    continue;
                var authorReact = authorReacts.get(msg.author.id);
                if(authorReact === undefined)
                    authorReact = new KarmaInfo(0,0,0,0,0);
                var upvotes = reacts.get('upvote:562330233315917843');
                upvotes = upvotes ? upvotes.count + authorReact.upvotes : authorReact.upvotes;
                var downvotes = reacts.get('downvote:562330227322388485');
                downvotes = downvotes ? downvotes.count + authorReact.downvotes : authorReact.downvotes;
                var platinum = reacts.get('redditplatinum:586161821338042379');
                platinum = platinum ? platinum.count + authorReact.platinum : authorReact.platinum;
                var gold = reacts.get('redditgold:586161821551951882');
                gold = gold ? gold.count + authorReact.gold : authorReact.gold;
                var silver = reacts.get('redditsilver:586161821044441088');
                silver = silver ? silver.count + authorReact.silver : authorReact.silver;
                authorReacts.set(msg.author.id,new KarmaInfo(upvotes,downvotes,platinum,gold,silver))
                messagesCount++;
            }
            
            opts.before = messages.last().id;
            console.log(messagesCount);
            
        }while(messages.size == 100);
        fs.writeFile(client.root+'/reactStore.json', JSON.stringify(Array.from(authorReacts)), 'utf8', function(err, result) {
            if(err) console.log('error', err);
            else message.channel.send('Success');
          });
        
   }
}

