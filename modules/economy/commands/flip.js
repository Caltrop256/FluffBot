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

    async execute(client, args, message) {
        class MersenneTwister {
            constructor() {
                this.N = 624;
                this.M = 397;
                this.MATRIX_A = 0x9908b0df;
                this.UPPER_MASK = 0x80000000;
                this.LOWER_MASK = 0x7fffffff;

                this.mt = new Array(this.N);
                this.mti = this.N + 1;

                this.initSeed = function (s) {
                    this.mt[0] = s >>> 0;
                    for (this.mti = 1; this.mti < this.N; this.mti++) {
                        var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
                        this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
                        this.mt[this.mti] >>>= 0;
                    };
                };
                this.randomInt = function () {
                    var y;
                    var mag01 = new Array(0x0, this.MATRIX_A);
                    if (this.mti >= this.N) {
                        var kk;
                        if (this.mti == this.N + 1)
                            this.init_seed(5489);
                        for (kk = 0; kk < this.N - this.M; kk++) {
                            y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                            this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
                        }
                        for (; kk < this.N - 1; kk++) {
                            y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                            this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
                        }
                        y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
                        this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
                        this.mti = 0;
                    };
                    y = this.mt[this.mti++];
                    y ^= (y >>> 11);
                    y ^= (y << 7) & 0x9d2c5680;
                    y ^= (y << 15) & 0xefc60000;
                    y ^= (y >>> 18);
                    return y >>> 0;
                }
                this.randomLong = function () {
                    var a = this.randomInt() >>> 5,
                        b = this.randomInt() >>> 6;
                    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
                }
            };
        };
        var seed = (Date.now() * (((message.author.username.toString().charCodeAt(0) - 97) || 1) * Math.random()) * ((message.content.toString().charCodeAt(0) - 97) * Math.random())) / 3;
        var generator = new MersenneTwister()
        generator.initSeed(seed);
        var intNumber = generator.randomLong();
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
            .setFooter(`Seed: ${seed}`)
            .setTimestamp()
            .setImage(`attachment://result.gif`);

        if (!args.length) {
            embed.setColor(result == 'edge' ? client.constants.neonGreen.hex : client.constants.green.hex);
            message.channel.send({ embed, files: [resultAtt] });
        } else {
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