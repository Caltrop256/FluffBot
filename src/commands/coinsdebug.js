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
    name: 'coinsdebug',
    aliases: ['cd'],
    description: 'Debug Database',
    args: true,
    usage: '<@user> <amount of coins>',
    guildOnly: false,
    rateLimit: {
        usages: Infinity,
        duration: 1,
        maxUsers: 1
    },
    permLevel: 5, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {


        let receivingUser = client.getMemberFromArg(receivedMessage, arguments)
        if(!receivingUser) return receivedMessage.reply("Couldn't find specified user");
        if(!arguments[1] || isNaN(arguments[1])) return receivedMessage.reply("You didn't specify an amount of coins.")
        var giveNumber = parseInt(arguments[1])

        connection.query(`SELECT * FROM coins WHERE id = '${receivingUser.id}'`, (err, rows) => {
            if(err) throw err;
            let sql;
            if(rows.length < 1) {
                sql = `INSERT INTO coins (id, coins) VALUES ('${receivingUser.id}', ${giveNumber})`
            } else {
                let coins = rows[0].coins;
                sql = `UPDATE coins SET coins = ${giveNumber} WHERE id = '${receivingUser.id}'`
            }
            connection.query(sql, console.log)
            client.addEntry(receivedMessage.id, giveNumber, 126)
        })
        
    }
}