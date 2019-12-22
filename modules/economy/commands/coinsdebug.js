/*const Discord = require('discord.js');
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
*/

module.exports = {
    name: 'coinsdebug',
    aliases: ['cd'],
    description: 'Manually set user\'s coin count',
    args: true,
    usage: '<@user> <amount of coins>',
    rateLimit: {
        usages: Infinity,
        duration: 1,
        maxUsers: 2
    },
    perms: ['DEV'],

    execute(client, args, message) {


        let receivingUser = client.getMember(args[0], message.guild, message.member);
        if(!receivingUser) return message.reply("Couldn't find specified user");
        if(!args[1] || isNaN(args[1])) return message.reply("You didn't specify an amount of coins.")
        var giveNumber = parseInt(args[1])
        var addMoney = false;
        if(args.length > 2)
            addMoney = args[2].toLowerCase() === 'true';
        client.updateMoney(receivingUser.id,giveNumber,!addMoney).then(() => message.react('✅')).catch((err) => { message.react('⛔');message.send(err)});
        
    }
}