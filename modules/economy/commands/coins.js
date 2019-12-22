'use strict';



module.exports = {
    name: 'coins',
    aliases: ['coin', 'coinamount', 'bank', 'lotsamoney', 'mullah', 'cash', 'funds', 'loadsofemone', 'dosh', 'cosh', 'dogecoin', 'ralcoin'],
    description: `Displays the amount of money a user has`,
    args: false,
    usage: '<@user>',
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    async execute(client, args, message) {

        var receivingGuildUser = client.getMember(args[0], message.guild, message.member);
        if(!receivingGuildUser) {console.log("ending"); return message.reply("Couldn't find user")}
        var receivingUser = receivingGuildUser.user;
        

        var time = client.time.fromString(args[1],true,null,true);

        if(args[2]) {
            if(args[2].match(/[0-9]+/)) {
                var yNodes = parseInt(args[2])
            } else yNodes = 7
        } else yNodes = 7

        if(args[3]) {
            if(args[3].match(/[0-9]+/)) {
                var xNodes = parseInt(args[3])
            } else xNodes = 7
        } else xNodes = 7
        var filteredTag = receivingUser.tag.replace(/[^\x00-\x7F]/gi, "");

        var coinEmbed = client.scripts.getEmbed()
        .setColor("#00FF00")
        .setAuthor(receivingGuildUser.displayName, receivingUser.avatarURL, receivingUser.avatarURL)
        .setTimestamp()
        //.addField("💸", `\`${client.scripts.numComma(uCoins)} ${client.cfg.curName}\`!`);
        var userCoins = null;
        if(message.content.toLowerCase().includes("dogecoin")) coinEmbed.setThumbnail("https://i.imgur.com/aUSiZ12.png")
        try {
            var moneyInfo = await client.getMoney(receivingUser.id)
            var graph = await client.getGraph(receivingUser.id,filteredTag,receivingGuildUser.displayHexColor,`${filteredTag}'s ${client.cfg.curName} over time`,xNodes,yNodes,true,time)
            userCoins = moneyInfo.coins;
            var attachment = client.scripts.getAttachment(graph, "graph.png");
            coinEmbed
            .setFooter(`Graph of ${receivingGuildUser.displayName}'s income over time`)
            .attachFile(attachment)
            .setImage('attachment://graph.png');
        }
        catch(err) {
            var errMsg = '';
            var errType = ''
            if(err != 1) 
                userCoins = moneyInfo.coins;    
            switch(err) 
            {
                case 1:errMsg = 'This user has never received or spent any money, what a Lurker';break;
                case 2:errMsg = 'No entries found.';break;
                case 3:errMsg = 'Not enough entries to draw a complete Graph!';break;
                case 4:errType = 'SQL';break;
                default:errType = 'unknown';break;
            }
            if(errMsg.includes('entries'))
                errMsg += time ? ' Try using a different time arg.' : '';
            errMsg = errType ? `An ${errType} error has occurred while trying to get the user\'s money. Please contact one of the devs about this.` : errMsg;
            coinEmbed.setFooter(errMsg);
        }   
        finally{
            if(userCoins !== null) coinEmbed.addField("💸", `**${client.scripts.numComma(moneyInfo.coins)} ${client.cfg.curName}**!`);
            message.channel.send({embed: coinEmbed})
        };
    }
};

