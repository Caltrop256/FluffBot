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
    name: 'flip',
    aliases: ['coin', 'flipcoin', 'realaddictionhours'],
    description: 'Flips a coin',
    args: false,
    usage: '<heads|tails|edge> <bet> | <info>',
    advUsage: '__Rewards__:\nHeads & Tails: Your bet x2\nEdge: Your bet x50\n__Chances__:\nHeads or Tails: \`98%\`\nEdge: \`2%\`',
    guildOnly: false,
    rateLimit: {
        usages: 3,
        duration: 25,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        if(!arguments.length) {

            

            var seed = (Date.now() * ((receivedMessage.author.username.toString().charCodeAt(0) - 97) * Math.random()) * ((receivedMessage.content.toString().charCodeAt(0) - 97) * Math.random())) / 3
            generator.init_seed(seed);

            console.log(seed)

            var intNumber = generator.random_long();
            
            var randomNumber = (intNumber * 100).toString()
            console.log(intNumber.toFixed(2))   

        const headsEmbed = new Discord.RichEmbed()
            .setTitle("The coin landed on Heads!")
            .setAuthor("Coin Flip")
            .setColor(embedGreen)
            .attachFile(headsAttachment)
            .setFooter(`Seed: ${seed}`)
            .setTimestamp()
        
        
        const tailsEmbed = new Discord.RichEmbed()
            .setTitle("The coin landed on Tails!")
            .setAuthor("Coin Flip")
            .setColor(embedGreen)
            .attachFile(tailsAttachment)
            .setFooter(`Seed: ${seed}`)
            .setTimestamp()
        
        
        const edgeEmbed = new Discord.RichEmbed()
            .setTitle("The coin landed on its edge!")
            .setAuthor("Coin Flip")
            .setColor(embedNeon_Green)
            .attachFile(edgeAttachment)
            .setFooter(`Seed: ${seed}`)
            .setTimestamp()

        if (randomNumber < 3) {receivedMessage.channel.send({embed: edgeEmbed})}
        if (randomNumber > 2 && randomNumber < 49) {receivedMessage.channel.send({embed: tailsEmbed})}
        if (randomNumber > 48 && randomNumber < 101) {receivedMessage.channel.send({embed: headsEmbed})}
        

        console.log("random number => " + randomNumber)
        }

        if(arguments.length) {

            if(arguments[0].includes("info")) {
                var flipInfo = new Discord.RichEmbed()
                .setAuthor(`Flip-A-Coin`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
                .addField("Usage", `Do \`${client.cfg.prefix}flip <side> <bet>\`, where \`<side>\` is either  \`tails\`, \`heads\` or \`edge\` and \`<bet>\` is the amount of ${client.cfg.curName} you want to bet!`)
                .addField("Probabilities", `The chances for the coin to land on either \`heads\` or \`tails\` is 49%, the chance for it to land on \`edge\` is only 2%.\nThere are over \`1.80*10^16\` different outcomes, which is almost half the amount of Atoms in the observable Universe.`)
                .addField("Rewards", "Landing on either `heads` or `tails` = Your bet times 2\nLanding on `edge` = Your bet times 50")
                .setColor(embedGreen)
                .setFooter("Have fun losi- playing the game!!")

                return receivedMessage.channel.send({embed: flipInfo})
            }

            var infCur = false
            if(arguments) {
                if(arguments.join().includes("-i")) {var infCur = true}
            }
            var cleanarg0 = arguments.join().match(/\b(h+(e+a+d+(s+)?)?|t+(a+i+l+(s+)?)?|e+(d+g+e+)?|seed)\b/i)
            if(!cleanarg0) {return receivedMessage.reply("Please specify either `tails`, `heads` or `edge`.")}
            cleanarg0 = cleanarg0.shift()
            console.log(cleanarg0)
            if(cleanarg0.match(/\bh+(e+a+d+(s+)?)?\b/i)) {var uBet = "heads"}
            if(cleanarg0.match(/\bt+(a+i+l+(s+)?)?\b/i)) {var uBet = "tails"}
            if(cleanarg0.match(/\be+(d+g+e+)?\b/i)) {var uBet = "edge"}
            if(cleanarg0 == "seed") {var uBet = "-s"}

            if(infCur == false) {
            if(!uBet) {return receivedMessage.reply("Please specify either `tails`, `heads` or `edge`.")}
            var regexMonDetect = arguments.join().match(/[1-9][0-9]*/i)
            if(!regexMonDetect || isNaN(regexMonDetect)) return receivedMessage.reply(`Please provide a valid amount of \`${client.cfg.curName}\` to bet.`)
            if(regexMonDetect.includes("-")) {return receivedMessage.reply("nice try.")}
            if(Math.sign(parseInt(regexMonDetect)) < 0) {return receivedMessage.reply("nice try.")}
            }

            if((uBet == "-s" || infCur == true) && receivedMessage.author.id.toString() !== "214298654863917059") {return receivedMessage.reply("You require Permission Level 5 to use these parameters.")}


            var usernameNumb = receivedMessage.author.username.toString().charCodeAt(0) - 97 !== 0 ? receivedMessage.author.username.toString().charCodeAt(0) - 97 : -3
            var messageContentNumb = receivedMessage.content.toString().charCodeAt(0) - 97 !== 0 ? receivedMessage.content.toString().charCodeAt(0) - 97 : -3
            var seed = (Date.now() * ((usernameNumb) * Math.random()) * ((messageContentNumb) * Math.random())) / 3
            if(uBet == "-s") {var seed = parseInt(regexMonDetect)}
            if(!seed || seed == 0 || isNaN(seed)) return receivedMessage.reply(`There has been an Error while calculating your Seed, please try again later.`)
            generator.init_seed(seed);

            var intNumber = generator.random_long();
            
            var randomNumber = (intNumber * 100).toString()

            if (randomNumber < 3) {var Result = "edge"}
            if (randomNumber > 2 && randomNumber < 50) {var Result = "tails"}
            if (randomNumber > 49 && randomNumber < 101) {var Result = "heads"}


            if(Result == uBet) {var won = true}
            else {var won = false}

            if(Result.includes("tails") || Result.includes("heads")) {var wonAmount = parseInt(regexMonDetect) * 2}
            if(Result.includes("edge")) {var wonAmount = parseInt(regexMonDetect) * 50}

            wonAmount = wonAmount - parseInt(regexMonDetect)


            connection.query(`SELECT * FROM coins WHERE id = '${receivedMessage.author.id}'`, (err, rows) => {
                if(err) throw err;
                let sql;
                if(rows.length < 1) {
                    return receivedMessage.reply(`You don't have enough coins (0/${parseInt(regexMonDetect)})`)
                } else {
                    let coins = rows[0].coins;
                    if(coins - parseInt(regexMonDetect) < 0 && infCur == false) return receivedMessage.reply(`You don't have enough coins (${coins}/${parseInt(regexMonDetect)})`)
                    if(won == false && infCur == false) {
                        sql = `UPDATE coins SET coins = ${coins - parseInt(regexMonDetect)} WHERE id = '${receivedMessage.author.id}'`;
                        client.addEntry(receivedMessage.author.id, coins - parseInt(regexMonDetect), 102);
                    }
                    if(won == true && infCur == false) {
                        sql = `UPDATE coins SET coins = ${coins + wonAmount} WHERE id = '${receivedMessage.author.id}'`;
                        client.addEntry(receivedMessage.author.id, coins + wonAmount, 112);
                    }

                    function numComma(x) {
                        var parts = x.toString().split(".");
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        return parts.join(".");
                    }

                    var FlipEmbed = new Discord.RichEmbed()
                    .setTitle(`The coin landed on ${Result}!`)
                    .setAuthor("Coin Flip", receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
                    .setFooter(`Seed: ${seed}`)
                    .setTimestamp()
                    if(won == true) {
                        FlipEmbed.setDescription(`${receivedMessage.author} has won \`${numComma(wonAmount)} ${client.cfg.curName}\` in the Coinflip!`)
                        FlipEmbed.setColor(embedGreen)
                    }
                    if(won == false) {
                        FlipEmbed.setDescription(`${receivedMessage.author} has lost \`${numComma(parseInt(regexMonDetect))} ${client.cfg.curName}\` in the Coinflip :(`)
                        FlipEmbed.setColor(embedRed)
                    }
                    if(Result.includes("tails")) {FlipEmbed.attachFile(tailsAttachment)}
                    if(Result.includes("heads")) {FlipEmbed.attachFile(headsAttachment)}
                    if(Result.includes("edge")) {FlipEmbed.attachFile(edgeAttachment)}

                    receivedMessage.channel.send({embed: FlipEmbed})
                    if(won) {console.log(console.color.green(`[Economy] [Flip]`), `${receivedMessage.author.username} has won ${wonAmount}${client.cfg.curName}, ${uBet} - ${Result} : ${randomNumber}`)} else console.log(console.color.green(`[Economy] [Flip]`), `${receivedMessage.author.username} has lost ${regexMonDetect}${client.cfg.curName}, ${uBet} - ${Result} : ${randomNumber}`)
                }
                if(infCur == false) {connection.query(sql)}
            })

        }
    }
}


const embedRed = 0xFC4B4B
const embedGreen = 0x74B979
const embedNeon_Green = 0x1DFF2D

const headsAttachment = new Discord.Attachment('./images/heads.gif', 'heads.gif');
const tailsAttachment = new Discord.Attachment('./images/tails.gif', 'tails.gif');
const edgeAttachment = new Discord.Attachment('./images/edge.gif', 'edge.gif');




