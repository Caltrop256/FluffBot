const Discord = require('discord.js');
const config = require("./json/config.json");
const plotly = require('plotly')(config.pName,config.pToken);
var mysql = require('mysql');
if(config.maintenance == false) {
    var connection = mysql.createConnection({
        host     : `localhost`,
        port     : `3306`,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb,
        multipleStatements: true
    });
}else {
    var connection = mysql.createConnection({
        host     : config.mySQLHost,
        port     : config.mySQLPort,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb,
        multipleStatements: true
    });
}
module.exports = {
    name: 'history',
    aliases: ['transactions', 'transactionshistory'],
    description: `Shows a complete history of transactions`,
    args: false,
    usage: '<@user>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    async execute(client, arguments, receivedMessage) {
        var reqPage = arguments[0] ? parseInt(arguments[0]) : 1
        if(isNaN(reqPage) || reqPage <= 0) reqPage = 1

        console.log(historyString(arguments[0]))

        var requestedUser = client.getMemberFromArg(receivedMessage, arguments)
        if(!requestedUser) return receivedMessage.reply(`Couldn't find the requested User`)

        

        async function historyString(int) {
            var num = int.toString().padStart(3, `2`)
            var arr = num.split("")
            if(arr[0] != 1 || arr[1] > 1 || arr[2] < 1) return 'Unknown'

            if(num == 101) {
                return 'Got {{amt}} in a random drop'
            } else if(num == 102) {
                return 'Got {{amt}} '
            }
            
        }

        function GetEntries(ID) {
            return new Promise ((resolve, reject) => {
                connection.query("SELECT CASE WHEN ((SELECT COUNT(*) FROM usercoinchange WHERE UserID = '"+ID+"' AND DateChanged > NOW() - INTERVAL 1 MONTH) < 100) THEN ('SELECT DateChanged, Coins FROM usercoinchange WHERE UserID = \\'"+ID+"\\' ORDER BY DateChanged DESC LIMIT 100') ELSE ('SELECT DateChanged, Coins FROM usercoinchange WHERE UserID = \\'"+ID+"\\' AND DateChanged > NOW() - INTERVAL 1 MONTH ORDER BY DateChanged DESC') END INTO @test; PREPARE myQuery FROM @test; EXECUTE myQuery;DEALLOCATE PREPARE myQuery;", function (error, result, fields) {
                    if(error) {
                        reject(error);
                    } else resolve(result[2]);
                });
            });
        }
        var entries = await GetEntries(requestedUser.user.id)


    }
}