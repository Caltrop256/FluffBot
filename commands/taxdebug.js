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
    name: 'taxdebug',
    aliases: ['tax'],
    description: 'Debug taxes',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: Infinity,
        duration: 1,
        maxUsers: 1
    },
    permLevel: 5, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        var receivingUser = client.getMemberFromArg(receivedMessage, arguments)
        if(!receivingUser) {receivingUser = receivedMessage.member}

        console.log('--------------------\nTaxation Begin');

        if(arguments.length) {
            connection.query(`SELECT * FROM coins WHERE id = '${receivingUser.id}'`, async (err, rows) => {
                if(err) throw err;
                if(rows.length < 1) {
                    return receivedMessage.reply("No such User")
                } else {
                    var row = rows[0]

                    var mainGuild = client.guilds.get("562324876330008576");
                var members = Array.from(mainGuild.members.filter(m => !m.user.bot))

                var Taxpercentage = row.coins / (members.length * 1000) * 100

                if(Taxpercentage > 35) {Taxpercentage = 35}

                TotalCollectedMoney = TotalCollectedMoney + parseInt(row.coins) * parseInt(Taxpercentage) / 100

                return console.log(`${row.id}, ${numComma(Math.round(row.coins))} => ${Taxpercentage.toFixed(2)}% (${numComma(Math.round(row.coins - parseInt(row.coins) * parseInt(Taxpercentage) / 100))})`)

                }
                
            })
        }

        connection.query(`SELECT * FROM coins`, async (err, rows) => {
            if(err) throw err;
            let sql;
            var TotalSum = '';

            connection.query(`SELECT SUM(coins) total FROM coins;`, (err, rows) => {
                if(err) throw err;

                TotalSum = rows[0].total
            })

            function numComma(x) {
                var parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");
            }

            var TotalCollectedMoney = 0;

            console.log("ID               | Coins | Tax Rate | (taxxed)")
            await rows.forEach(async row => {
                var mainGuild = client.guilds.get("562324876330008576");
                var members = Array.from(mainGuild.members.filter(m => !m.user.bot))

                var Taxpercentage = row.coins / (members.length * 1000) * 100

                if(Taxpercentage > 35) {Taxpercentage = 35}

                TotalCollectedMoney = TotalCollectedMoney + parseInt(row.coins) * parseInt(Taxpercentage) / 100

                console.log(`${row.id}, ${numComma(Math.round(row.coins))} => ${Taxpercentage.toFixed(2)}% (${numComma(Math.round(row.coins - parseInt(row.coins) * parseInt(Taxpercentage) / 100))})`)
            })



            console.log(`Taxed Money total = ${numComma(Math.round(TotalCollectedMoney))} ${client.cfg.curName}`)
            /*setTimeout(() => {
                console.log(TotalSum)
                var mainGuild = client.guilds.get("562324876330008576");
                var members = Array.from(mainGuild.members.filter(m => !m.user.bot))

                var taxpercentage = TotalSum / (members.length * 5000) * 100

                console.log(`${taxpercentage}%`)

                /*sql = `UPDATE coins SET coins = coins - (coins * ${taxpercentage} / 100.0) WHERE coins >=250;`
                connection.query(sql, console.log)
                receivedMessage.reply(`Taxrate = ${taxpercentage}%\nTotal ${client.cfg.curName} = ${TotalSum}`)
                
            }, 1000);*/
        })
    }
}