const Discord = require('discord.js');
const config = require("./json/config.json");
var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();
var mysql = require('mysql');
if(config.maintenance == false) {
    var connection = mysql.createConnection({
        host     : `localhost`,
        port     : `3306`,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}else {
    var connection = mysql.createConnection({
        host     : config.mySQLHost,
        port     : config.mySQLPort,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}

module.exports = {
    name: 'lottery',
    aliases: ['daily', 'happyluckylottery'],
    description: 'Flips a coin',
    args: false,
    usage: '<heads|tails|edge> <bet> | <info>',
    guildOnly: false,
    rateLimit: {
        usages: 1,
        duration: 20,
        maxUsers: 3
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

        var Reward0 = 10;
        var Reward1 = 100;
        var Reward2 = 1000;
        var Reward3 = 10000;
        var Reward4 = 100000;

        var seed = (Date.now() * ((receivedMessage.author.username.toString().charCodeAt(0) - 97) * Math.random()) * ((receivedMessage.content.toString().charCodeAt(0) - 97) * Math.random())) / 3
        generator.init_seed(seed);

        console.log(seed)

        function genNumber(seed) {
            while (true) {
                var intNumber = generator.random_long();
                var gn = Math.floor(intNumber * 10)
                if(gn <= 9) {
                    return gn
                }
            }
        }

        var usernums = [];
        
        usernums = arguments.join().match(/\d/gi)

        if(usernums) {
            usernums.length = 4
            if(!usernums[0]) {usernums.push(genNumber(seed))}
            if(!usernums[1]) {usernums.push(genNumber(seed))}
            if(!usernums[2]) {usernums.push(genNumber(seed))}
            if(!usernums[3]) {usernums.push(genNumber(seed))}
        } else {
            usernums = [
                genNumber(seed),
                genNumber(seed),
                genNumber(seed),
                genNumber(seed)
            ]
        }

        usernums = usernums.filter(function (el) {
            return el != null;
        });

        console.log(usernums)

        var LotSetNums = [
            num1 = {
                pos: 0,
                value: genNumber(seed)
            },
            num2 = {
                pos: 1,
                value: genNumber(seed)
            },
            num3 = {
                pos: 2,
                value: genNumber(seed)
            },
            num4 = {
                pos: 3,
                value: genNumber(seed)
            }
        ];

        var usernums = [
            num1 = {
                pos: 0,
                value: parseInt(usernums[0])
            },
            num2 = {
                pos: 1,
                value: parseInt(usernums[1])
            },
            num3 = {
                pos: 2,
                value: parseInt(usernums[2])
            },
            num4 = {
                pos: 3,
                value: parseInt(usernums[3])
            }
        ];
        /*console.log("Winning Numbers")
        console.log(LotSetNums)
        console.log("User Numbers")
        console.log(usernums)*/

        var finNum0 = {};
        var finNum1 = {};
        var finNum2 = {};
        var finNum3 = {};

        LotSetNums.forEach(num => {
            var endnum = {
                pos: num.pos,
                value: num.value,
                won: false
            }
            if(num.value == usernums[num.pos].value) {
                endnum.won = true
            }
            if(num.pos == 0) finNum0 = endnum
            if(num.pos == 1) finNum1 = endnum
            if(num.pos == 2) finNum2 = endnum
            if(num.pos == 3) finNum3 = endnum
        })

        if(finNum3.won == false) {finNum2.won = false; finNum1.won = false; finNum0.won = false;}
        if(finNum2.won == false) {finNum1.won = false; finNum0.won = false;}
        if(finNum1.won == false) {finNum0.won = false;}

        var matches = 0;

        if(finNum0.won == true) {
            finNum0.value = `[${finNum0.value}]`
            usernums[0].value = `[${usernums[0].value}]`
            matches++
        }
        if(finNum1.won == true) {
            finNum1.value = `[${finNum1.value}]`
            usernums[1].value = `[${usernums[1].value}]`
            matches++
        }
        if(finNum2.won == true) {
            finNum2.value = `[${finNum2.value}]`
            usernums[2].value = `[${usernums[2].value}]`
            matches++
        }
        if(finNum3.won == true) {
            finNum3.value = `[${finNum3.value}]`
            usernums[3].value = `[${usernums[3].value}]`
            matches++
        }

        console.log(finNum0)
        console.log(finNum1)
        console.log(finNum2)
        console.log(finNum3)

        console.log(`matches: ${matches}`)

        var happyluckylotteryEmbed = new Discord.RichEmbed()
        .setTitle('Your h')
        .addField(`Results`, `Winning Numbers: \`${finNum0.value} ${finNum1.value} ${finNum2.value} ${finNum3.value}\`\n\nYour Numbers: \`${usernums[0].value} ${usernums[1].value} ${usernums[2].value} ${usernums[3].value}\`\n\`${matches}\` matches.`)

        receivedMessage.channel.send({embed: happyluckylotteryEmbed})
    }
}