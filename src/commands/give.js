const Discord = require('discord.js');
const config = require("./json/config.json");
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
    name: 'give',
    aliases: ['lend', 'send', 'pay'],
    description: 'Give another user a specific amount of your money',
    args: true,
    usage: '<@user> <amount of coins>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {


        let receivingUser = client.getMemberFromArg(receivedMessage, arguments)
        if(!receivingUser) return receivedMessage.reply("Couldn't find specified user");
        var giveNumber = parseInt(arguments[1]) 
        if(!giveNumber || isNaN(giveNumber)) {return receivedMessage.reply("please provide a valid amount of money to give.")}
        if(Math.sign(parseInt(giveNumber)) < 0) {return receivedMessage.reply("nice try.")}
        if(receivingUser === receivedMessage.member) {return receivedMessage.reply("you can't give yourself " + client.cfg.curName)}

        connection.query(`SELECT * FROM coins WHERE id = '${receivedMessage.author.id}'`, (err, rows) => {
            if(err) throw err;
            let sql;
            if(rows.length < 1) {
                return receivedMessage.reply(`You don't have enough coins (0/${numComma(parseInt(giveNumber))})`)
            } else {

                function numComma(x) {
                    var parts = x.toString().split(".");
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return parts.join(".");
                }

                let coins = rows[0].coins;
                if(coins - giveNumber < 0) {return receivedMessage.reply(`You don't have enough coins (${numComma(coins)}/${numComma(parseInt(giveNumber))})`)}

                sql = `UPDATE coins SET coins = ${coins - giveNumber} WHERE id = '${receivedMessage.author.id}'`
                client.addEntry(receivedMessage.author.id, coins - giveNumber, 103)


                var GiveEmbed = new Discord.RichEmbed()
                .setAuthor(receivedMessage.member.displayName, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
                .addField("💸", `Gave \`${numComma(parseInt(giveNumber))} ${client.cfg.curName}\` to **${receivingUser.displayName}**`)
                .setColor("#00FF00")

                receivedMessage.channel.send({embed: GiveEmbed})

            }
            connection.query(sql)
        })    

        connection.query(`SELECT * FROM coins WHERE id = '${receivingUser.id}'`, (err, rows) => {
            if(err) throw err;
            let sql;
            if(rows.length < 1) {
                sql = `INSERT INTO coins (id, coins) VALUES ('${receivingUser.id}', ${giveNumber})`
            } else {
                let coins = rows[0].coins;
                sql = `UPDATE coins SET coins = ${coins + giveNumber} WHERE id = '${receivingUser.id}'`
                client.addEntry(receivingUser.id, coins + giveNumber, 113)
            }
            connection.query(sql)
            console.log(console.color.green(`[Economy]`), `${receivedMessage.author.username} gave ${giveNumber}${client.cfg.curName} to ${receivingUser.user.username}`)
        })

       
    }
}