const Discord = require('discord.js');
const fs = require('fs');
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
    name: 'forceshutdown',
    aliases: ['shutdown', 'fuckoff', 'shut'],
    description: 'Forcefully shuts down the bot',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: 5,
        duration: 120,
        maxUsers: 2
    },
    permLevel: 3, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {

        connection.query(`UPDATE config SET value = '${receivedMessage.channel.id}' WHERE config = 'lastshutdown'`, console.log)
        setTimeout(() => {
            receivedMessage.author.send("TropBot-main.js shutting down")
            .catch(error => {
                console.error(`Could not send help DM to a user.\n`, error);
                receivedMessage.channel.send(`There was an Error while trying to send a Direct Message, this most likely occured because the user has their DMs set to friends only or private.`)
            });

            receivedMessage.channel.send({embed: shutdownEmbed})
            .then(async function (message){
                await message.react(":ralsleep:562354429093740544")
                client.destroy(); process.exit()
            })
        }, 1000);

    }
}

const embedReder = 0xFF0000

const shutdownEmbed = new Discord.RichEmbed()
  .setAuthor("Shutting down...")
  .setTitle("Goodnight.")
  .setColor(embedReder)
  .setTimestamp();
