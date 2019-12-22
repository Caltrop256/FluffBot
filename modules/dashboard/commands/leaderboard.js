'use strict';
const validArgs = ['coins', 'karma', 'pgs'];
const pgsTypes = ['platinum', 'gold', 'silver'];
const authorTypes = ['Top {0} wealthiest Members', 'Karma Leaderboard', 'Top {0} Members with the most {1}'];
const descTypes = [
    'Below you will find a list of {0}\'s {1} most wealthiest Members',
    //'Below you will find a list of {0}\'s {1} Members with the most Karma',
    'Karma is calculated by subtracting your downvotes from your upvotes',
    'Below you will find a list of {0}\'s {1} Members with the most {2}'
];
//
const colorTypes = ['green', 'perfectOrange', 'platinum']

module.exports = {
        name: 'leaderboard',
        aliases: ['lb', 'board'],
        description: 'Central leaderboard command',
        args: true,
        usage: ' <coins|karma|pgs>',
        rateLimit: {
            usages: 2,
            duration: 10,
            maxUsers: 2
        },
        perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

        async execute(client, args, message) {
            /*var emojis = {
                upvote = client.emojis.get('562330233315917843'),
                downvote = client.emojis.get('562330227322388485'),
                platinum = client.emojis.get('586161821338042379'),
                gold = client.emojis.get('586161821551951882'),
                silver = client.emojis.get('586161821044441088')
            }*/


            var boardType = args[0] ?
                args[0].replace(/^(gold|silver|platinum|plat)$/gi, 'pgs')
                .replace(/^(upvotes|downvotes)$/gi, 'karma')
                .replace(/^(coin|coinamount|bank|lotsamoney|mullah|cash|funds|loadsofemone|dosh|cosh|dogecoin|alcoin)$/gi, 'coins').toLowerCase() :
                '_invalid';
            var boardPage = (args[1] && isFinite(args[1]) && args[1] > 0) ? parseInt(args[1]) : 1;
            var boardIndex = validArgs.indexOf(boardType);
            if (boardIndex == -1)
                return message.reply('Invalid Board, try **' + client.scripts.endListWithAnd(validArgs, true) + '** instead');
            var pgsType = null;
            if (boardIndex == 2)
                pgsType = args[0] == 'plat' ? 'platinum' : args[0].replace('pgs', 'platinum');
            console.log(pgsTypes.indexOf(pgsType));
            var boardInfo = await client.getBoard(validArgs.indexOf(boardType), message.guild, pgsTypes.indexOf(pgsType));
            if (!boardInfo)
                return message.channel.send(`The \`${type ? 'Economy'  : 'Karma'}\` module is currently disabled`);

            var iconExt = message.guild.iconURL.includes('a_') ? 'gif' : 'png';
            var leaderboardEmbed = client.scripts.getEmbed()
                .setAuthor(authorTypes[boardIndex].format(boardInfo.entries.length, pgsType), message.author.avatarURL, message.author.avatarURL)
                .setDescription(descTypes[boardIndex].format(message.guild.name, boardInfo.entries.length, pgsType))
                .setColor(client.constants[colorTypes[boardIndex]].hex)
                .setTimestamp()
                .setThumbnail(message.guild.iconURL.replace(/jpg$/, iconExt));

            var leaderboardArray = [];
            for (var entry of boardInfo.entries) {
                //var rowMember = message.guild.members.get(entry.entryObj.id);

                leaderboardArray.push(entry.toString());
            }

            client.leaderboardSelect(message.channel, message, leaderboardEmbed, leaderboardArray);
            //message.channel.send({embed: leaderboardEmbed});
            //await getVoteBuffer(karmaInfo.upvotes,karmaInfo.downvotes)
        }
    } //authorTypes[boardIndex].replace('{0}', boardInfo.entries.length).replace('{1}', boardInfo.pgsType)
    // authorTypes[boardIndex].format(boardInfo.entries.length, boardInfo.pgsType)
    //descTypes[boardIndex].replace('{0}', message.guild.name).replace('{1}', boardInfo.entries.length)
    //descTypes[boardIndex].format(message.guild.name, boardInfo.entries.length,pgsType)