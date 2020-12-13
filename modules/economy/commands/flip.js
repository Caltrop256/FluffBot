'use strict';

module.exports = {
    name: 'flip',
    aliases: ['flipcoin', 'realaddictionhours'],
    description: 'Flips a coin',
    args: false,
    usage: '<heads|tails|edge> <bet> | <info>',
    advUsage: '__Rewards__:\nHeads & Tails: Your bet x2\nEdge: Your bet x50\n__Chances__:\nHeads or Tails: \`98%\`\nEdge: \`2%\`',
    rateLimit: {
        usages: 3,
        duration: 25,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    async execute(client, args, message)
    {
        var intNumber = require('crypto').randomBytes(4).readUInt32BE() / 0xffffffff;
        var randomNumber = (intNumber * 100).toString()
        let result = '';
        if (randomNumber <= 1) result = 'edge';
        if (randomNumber > 1 && randomNumber <= 51) result = 'tails';
        if (randomNumber > 51 && randomNumber < 100) result = 'heads';
        const headsAttachment = client.scripts.getAttachment(process.env.tropbot + '/assets/heads.gif', 'result.gif');
        const tailsAttachment = client.scripts.getAttachment(process.env.tropbot + '/assets/tails.gif', 'result.gif');
        const edgeAttachment = client.scripts.getAttachment(process.env.tropbot + '/assets/edge.gif', 'result.gif');

        const resultAtt = result == 'heads' ?
            headsAttachment :
            result == 'tails' ?
                tailsAttachment :
                edgeAttachment;

        const embed = client.scripts.getEmbed()
            .setTitle(`The coin landed on ${result == 'edge' ? 'its ' : ''}${result}!`)
            .setAuthor("Coin Flip")
            .setTimestamp()
            .setImage(`attachment://result.gif`);

        if (!args.length)
        {
            embed.setColor(result == 'edge' ? client.constants.neonGreen.hex : client.constants.green.hex);
            message.channel.send({ embed, files: [resultAtt] });
        } else
        {
            var cleanarg0 = args.join(" ").match(/\b(h+(e+a+d+(s+)?)?|t+(a+i+l+(s+)?)?|e+(d+g+e+)?)\b/i)
            if (!cleanarg0) return message.reply("Please specify either `tails`, `heads` or `edge`.")
            let iBet = cleanarg0[1];
            if (iBet.match(/\bh+(e+a+d+(s+)?)?\b/i)) var uBet = "heads";
            if (iBet.match(/\bt+(a+i+l+(s+)?)?\b/i)) var uBet = "tails";
            if (iBet.match(/\be+(d+g+e+)?\b/i)) var uBet = "edge";

            var monB = args.join(" ").match(/[1-9][0-9]*/i);
            if (!monB || isNaN(monB)) return message.reply(`Please provide a valid amount of \`${client.cfg.curName}\` to bet.`);
            if (Math.sign(parseInt(monB)) < 0) return message.reply("nice try.");

            let availableMoney = await client.getMoney(message.author.id);
            if ((availableMoney.coins - monB) < 0) return message.reply(`You do not have enough money! (\`${availableMoney.coins}\`/\`${monB}\`)`);

            let winAmt = uBet == 'edge' ?
                (monB * 50) - monB :
                (monB * 2) - monB;

            let won = uBet == result;

            embed.setDescription(`${message.author} has ${won ? `won **${client.scripts.numComma(winAmt)}` : `lost **${client.scripts.numComma(monB)}`} ${client.cfg.curName}** in the coinflip${won ? '!' : ' :('}`);
            embed.setColor(won ? client.constants.green.hex : client.constants.red.hex);
            message.channel.send({ embed, files: [resultAtt] });

            client.updateMoney(message.author.id, won ? winAmt : -Math.abs(monB));
        };

    }
};