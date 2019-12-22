module.exports = {
    name: 'giveaway',
    aliases: ['distribute', 'share'],
    description: 'distributes specified amount of coins to people',
    args: true,
    usage: '<amount> <time> <limit>',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'], 

    async execute(client, args, message) {
        var giverID = message.author.id;

        var amountArg = parseInt(args[0]);
        if(isNaN(amountArg) || (amountArg < 10)) return message.reply('bad moni >:c')

        var userMoni = ((await client.getMoney(giverID)).coins || 0) - amountArg;
        if(userMoni < 0) return message.reply('u broke lmao xd');

        var timeArg = !!args[1] ? args[1] : '1d';
        var time = client.time.fromString(timeArg);
        if(!time) return message.reply('bad time >:cc')
        if((time.ms > 2628028800 ) ||(time.ms < 1000)) return message.reply(`wtf time too ${time.ms < 1000 ? 'smol' : 'beeg'} >:c`)
        var userLimit = args[2] === undefined ? 1000 : parseInt(args[2]);
        if(isNaN(userLimit) || (userLimit <= 1) || (userLimit > 1000)) return message.reply('bad user >:ccc');

        time = Date.now() - time;
        if(message.guild.members.some(h => !h)) await message.guild.fetchMembers();
        var filteredUsers = message.guild.members.filter(m => !m.user.bot && (m !== message.member) && ((client.lastSeenCollec.get(m.user.id) || { date: 0 }).date > time));
        if(filteredUsers.size <= 1) return message.reply('bruh no one online. its real `$ischatdead` hours <:sunglasses:562330234079412234>');
        //fucking custom random function smh
        var randUsers = new Array(amountArg);
        var arr = filteredUsers.array().slice();
        var uniqueUsers = [];
        for (let i = 0; i < amountArg; i++) {
            if(uniqueUsers.length === userLimit)
                var arrItem = uniqueUsers[Math.floor(Math.random() * uniqueUsers.length)];
            else
                var arrItem =  arr[Math.floor(Math.random() * arr.length)];
            if(!randUsers.includes(arrItem))
                uniqueUsers.push(arrItem);
            randUsers[i] = arrItem;
        }
        //smh
        var beforeCoins = client.scripts.getCollection();
        var userCoins = client.scripts.getCollection();
        for (var member of randUsers) {
            var coins = userCoins.get(member.user.id);
            if (coins === undefined) {
                coins = (await client.getMoney(member.user.id)).coins || 0;
                beforeCoins.set(member.user.id,coins);
            }
            userCoins.set(member.user.id, ++coins);
        }

        var msg = await message.channel.send(client.scripts.getEmbed().setAuthor('ai mate u sur?', message.author.displayAvatarURL).setDescription(`yo, you sure u wanna give your **${amountArg} gaybux** to these ${userCoins.size} pps?`).setColor(client.constants.perfectOrange.hex).setTimestamp())
        var emojis = ['✅', '❎']
        await msg.react(emojis[0]);
        await msg.react(emojis[1]);
        const filter = (reaction, user) => {
            return user.id != msg.author.id;
        };
        var collector = msg.createReactionCollector(filter, { time: 60000 });
        collector.on('collect', async reaction => {
            if (!emojis.includes(reaction.emoji.name)) return msg.reactions.last().remove(reaction.users.first().id);
            for (var u of reaction.users) {
                if ((u[0] != giverID) && (u[0] != msg.author.id)) {
                    return reaction.remove(u[0]);
                };
            };
            collector.stop();
            if (reaction.emoji.name == emojis[0]) {
                await client.updateMoney(giverID, userMoni, true);
                for (var [userID, moneyInfo] of userCoins) {
                    await client.updateMoney(userID, moneyInfo, true);
                    console.log(`${client.users.get(userID).tag}: ${beforeCoins.get(userID)}-${userCoins.get(userID)}`);
                }
                message.channel.send('ay epic money gibeaway c:');
            } else {
                return message.channel.send('aw :c');
            };
        });
        collector.on('end', () => {
            msg.delete();
        });
    }
}

