// ready
/* Emitted when the client becomes ready to start working.    */

const Discord = require('discord.js');
const config = require("../commands/json/config.json");
const fs = require('fs');
const prettyMs = require('pretty-ms');
var schedule = require('node-schedule');
const wait = require('util').promisify(setTimeout);
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

const embedGreen = 0x74B979


module.exports = (client) => {

    let channel_id_color = "562328013371605012"; 
    let message_id_color = client.cfg.color1;

    let channel_id_color2 = "562328013371605012"; 
    let message_id_color2 = client.cfg.color2;

    let channel_id_other = "562328013371605012"; 
    let message_id_other = client.cfg.other1;

    let channel_id = "562586739819151370"; 
    let message_id = client.cfg.ruleAccept;
    
    /*var taxationRule = new schedule.RecurrenceRule();
    taxationRule.minute = 0;

    var TaxationProcess = schedule.scheduleJob(taxationRule, function(){
        console.log('--------------------\nTaxation Begin');

        connection.query(`SELECT * FROM coins`, (err, rows) => {
            if(err) throw err;
            let sql;
            var TotalSum = '';

            connection.query(`SELECT SUM(coins) total FROM coins;`, (err, rows) => {
                if(err) throw err;

                TotalSum = rows[0].total
            })
            setTimeout(() => {
                console.log(TotalSum)
                var mainGuild = client.guilds.get("562324876330008576");
                var members = Array.from(mainGuild.members.filter(m => !m.user.bot))

                var taxpercentage = TotalSum / (members.length * 5000) * 100

                console.log(`${taxpercentage}%`)

                sql = `UPDATE coins SET coins = coins - (coins * ${taxpercentage} / 100.0) WHERE coins >=250;`
                connection.query(sql, console.log)
            }, 1000);
        })
      });*/
    
    console.log(console.color.red(`[META]`), "Connected as " + client.user.tag)

    client.channels.get(channel_id).fetchMessage(message_id).then(m => {
        console.log(console.color.magenta(`[Role-Selection]`), "Cached reaction message.");
    }).catch(e => {
    console.error("Error loading message.");
    console.error(e);
    });

    client.channels.get(channel_id_color).fetchMessage(message_id_color).then(m => {
        console.log(console.color.magenta(`[Role-Selection]`), "Cached color reaction message.");
    }).catch(e => {
    console.error("Error loading message.");
    console.error(e);
    });

    client.channels.get(channel_id_color2).fetchMessage(message_id_color2).then(m => {
        console.log(console.color.magenta(`[Role-Selection]`), "Cached color2 reaction message.");
    }).catch(e => {
    console.error("Error loading message.");
    console.error(e);
    });

    client.spam.lmsgChannel = {}
    client.guilds.forEach((guild) => {
        if(guild.voiceConnection) guild.voiceConnection.disconnect()
        guild.channels.forEach((channel) => {
            if(channel.type == "text") {
                client.spam.lmsgChannel[channel.id] = [];
            }
        })
        // main testing channel id: 559034705459150848
    });

    client.channels.get(channel_id_other).fetchMessage(message_id_other).then(m => {
        console.log(console.color.magenta(`[Role-Selection]`), "Cached other reaction message.");
    }).catch(e => {
    console.error("Error loading message.");
    console.error(e);
    });
    mainGuild = client.guilds.get("562324876330008576");
    mainGuild.members.forEach(m => {
        if(m.voiceChannelID) {
            if(!m.roles.has("598883824830513152")) m.addRole("598883824830513152", "guess")
        } else if(m.roles.has("598883824830513152")) m.removeRole("598883824830513152", "guess")
    })
    wait(1000);


    // Load all invites for all guilds and save them to the cache.
    client.guilds.forEach(g => {
        g.fetchInvites().then(guildInvites => {
        client.invites[g.id] = guildInvites;
        });
    });

    
    async function intervalFunc() {


        var mainGuild = client.guilds.get("562324876330008576");
        var members = Array.from(mainGuild.members.filter(m => !m.user.bot))
        var channels = Array.from(mainGuild.channels)
        

/*
        var mainGuild = client.guilds.get("562324876330008576");
        var messagesArray = [];
        mainGuild.channels.forEach(async channel => {
            if(channel.type == "text") {
                if(channel.parentID == "562326933447114752" || channel.parentID == "562327015567654932" || channel.parentID == "56233635422325968") {

                const msg = await channel.fetchMessages({limit: 20});
                messagesArray.push(...msg.array())
                }
            }
        })
        setTimeout(() => {
            messagesArray.length = 20
            var firstMessage = messagesArray[0]

            var timestampArray = []
            var timestampArrayB = []

            messagesArray.forEach(m => {
                timestampArray.push(m.createdTimestamp)
                timestampArrayB.push(m.createdTimestamp)
            })

            timestampArrayB.shift()
                var timestampArrayReduced = []

                for(var i = 0;i<=timestampArrayB.length-1;i++) {
                timestampArrayReduced.push(timestampArray[i] - timestampArrayB[i]);
                }

                const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    
                const result = average(timestampArrayReduced);

                const evaluationNumber = 60000

                var NoActivitySince = new Date() - firstMessage.createdTimestamp
                if(NoActivitySince < 0) {var NoActivitySince = 1}

                var lastmsgmultiplier = NoActivitySince / 60000
                var msgDelaymultiplier = result / 60000

                var verdictNumber = ((lastmsgmultiplier * evaluationNumber) + (msgDelaymultiplier * evaluationNumber)) / 2

                verdictNumMultiplier = verdictNumber / 60000
                var verdictNumFinal = verdictNumMultiplier / 2.5


                console.log("------")
                console.log("last msg  " + lastmsgmultiplier.toFixed(3))
                console.log("msg delay " + msgDelaymultiplier.toFixed(3))
                console.log("combined: " + verdictNumber.toFixed(3))
                console.log("verdict:  " + verdictNumFinal.toFixed(3))

        }, 1000);
    }catch(error) {
        console.log(error)
    }*/
        
    
        client.user.setStatus('available')
        client.user.setPresence({
            game: {
                name: `\nU: ${prettyMs(client.uptime, {verbose: false, compact: false}).replace(/.\d+s/, "s")}\n P: ${Math.round(client.ping)}ms`,
                type: "STREAMING",
                url: "https://www.twitch.tv/caltrop_"
            }
        });
    }
    setInterval(intervalFunc, 3000);

    function webhookfunc() {
        client.guilds.forEach((guild) => {guild.fetchWebhooks().then(webhooks => webhooks.forEach(webhook => {webhook.delete(100)}))});
        client.invites = {};
        client.guilds.forEach(g => {
            g.fetchInvites().then(guildInvites => {
            client.invites[g.id] = guildInvites;
            });
        });
    }
    setInterval(webhookfunc, 30000)


    
    if (client.cfg.lastshutdown !== "null") {

        var shutdownlogEmbed = new Discord.RichEmbed()
        .setAuthor("Succesfully restarted after Shutdown")
        .setTitle("Good Morning!")
        .setColor(embedGreen)
        .setTimestamp()

        const lastchannelshutdown = client.channels.get(client.cfg.lastshutdown)
        lastchannelshutdown.send({embed: shutdownlogEmbed})
        .then(function (message){
            message.react(":ralwave:562460716393562133")
        })
        connection.query(`UPDATE config SET value = 'null' WHERE config = 'lastshutdown'`, console.log)

    }

}