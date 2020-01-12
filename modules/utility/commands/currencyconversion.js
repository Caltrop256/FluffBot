'use strict';
const https = require('https');
module.exports = {
    name: 'currencyconversions',
    aliases: ['ccv'],
    description: 'Converts currencies',
    args: true,
    usage: '<amount> <currency 1> <currency 2>',
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {

        if (args.length >= 3) {
            var amt = parseFloat(args[0]);
            var cur1 = (args[1]) ? toCurrency(args[1]) : void 0;
            var cur2 = (args[2]) ? toCurrency(args[2]) : void 0;
        } else {
            var sepArg1 = args[0].match(/[0-9]+|[^0-9]+/gi)
            var amt = (sepArg1 && sepArg1[0]) ? parseFloat(sepArg1[0]) : 1;
            var cur1 = (sepArg1 && sepArg1[1]) ? toCurrency(sepArg1[1]) : void 0;
            var cur2 = (args[1]) ? toCurrency(args[1]) : void 0;
        }
        var regexTest = /[^a-zA-Z]/gi;
        if (regexTest.test(cur1) || regexTest.test(cur2)) return message.reply('Invalid characters');

        if (!cur1 || !cur2) return message.reply('Missing arguments');

        function toCurrency(s) {
            return s
                .replace(/^(C|CAN)\$$/i, 'CAD')
                .replace(/^(HK\$)$/i, 'HKD')
                .replace(/^(ikr\$)$/i, 'ISK')
                .replace(/^(peso)$/i, 'PHP') //ew php
                .replace(/^(dkr)$/i, 'DKK')
                .replace(/^(ft)$/i, 'HUF')
                .replace(/^(pounds?|£)$/i, 'GBP') //good boy points
                .replace(/^(l)$/i, 'RON')
                .replace(/^(skr)$/i, 'SEK')
                .replace(/^(rp)$/i, 'IDR')
                .replace(/^(₹|iR)$/i, 'INR')
                .replace(/^(r\$)$/i, 'BRL')
                .replace(/^(р|руб)$/i, 'RUB')
                .replace(/^(kn)$/i, 'HRK')
                .replace(/^(yen|¥|円)$/i, 'JPY')
                .replace(/^(฿)$/i, 'THB')
                .replace(/^(Fr)$/i, 'CHF')
                .replace(/^(€|euros?)$/i, 'EUR')
                .replace(/^(rm)$/i, 'MYR')
                .replace(/^(лв|lv|Lw)$/i, 'BGN')
                .replace(/^(₺|TL)$/i, 'TRY')
                .replace(/^(yuan|元)$/i, 'CNY')
                .replace(/^(NZ\$)$/i, 'NZD')
                .replace(/^(US\$|\$)$/i, 'USD')
                .replace(/^(mex\$)$/i, 'MXN')
                .replace(/^(S\$|SG\$)$/i, 'SGD')
                .replace(/^(AU\$)$/i, 'AUD')
                .replace(/^(schekels?|₪|שקל חדש|ש״ח)$/i, 'ILS')
                .replace(/^(₩)$/i, 'KRW')
                .replace(/^(Złoty)$/i, 'PLN')
                .toUpperCase();
        }

        client.https.GETJson(`https://api.exchangeratesapi.io/latest?base=${cur1}&symbols=${cur2}`).then((c) => {
            if (c.error) return message.reply('You used an invalid currency type, apologies.')

            var embed = client.scripts.getEmbed()
                .setAuthor('Currency Conversion')
                .setColor(client.constants.green.hex)
                .setFooter('Last updated')
                .addField('Input', `\`${amt} ${cur1}\``, true)
                .addField('Output', `\`${c.rates[cur2] * amt} ${cur2}\``, true)
                .setTimestamp(c.date);

            message.channel.send({ embed })
        }).catch((err) => {
            console.log(err);
            message.reply(`An Error occured while trying to fetch currency data.`);
        })
    }
}
