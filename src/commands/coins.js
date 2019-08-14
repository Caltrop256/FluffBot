const Discord = require('discord.js');
const config = require("./json/config.json");
const plotly = require('plotly')(config.pName,config.pToken);
const ms = require('ms');
const prettyMs = require('pretty-ms');
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
    name: 'coins',
    aliases: ['coin', 'coinamount', 'bank', 'lotsamoney', 'mullah', 'cash', 'funds', 'loadsofemone', 'dosh', 'cosh', 'dogecoin', 'ralcoin'],
    description: `Displays the amount of money a user has`,
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

        var receivingUser = client.getMemberFromArg(receivedMessage, arguments)
        if(!receivingUser) {console.log("ending"); return receivedMessage.reply("Couldn't find user")}

        if(arguments[1]) {
            if(arguments[1].match(/[0-9]*(ms|s|m|h|d|w|y)$/gi)) {
                var time = ms(arguments[1])
            } else time = ms(arguments[1] + "d")
        } else time = Infinity
        if(!time) time = Infinity

        if(arguments[2]) {
            if(arguments[2].match(/[0-9]+/)) {
                var ynodes = parseInt(arguments[2])
            } else ynodes = 7
        } else ynodes = 7

        if(arguments[3]) {
            if(arguments[3].match(/[0-9]+/)) {
                var xnodes = parseInt(arguments[3])
            } else xnodes = 7
        } else xnodes = 7


        connection.query(`SELECT * FROM coins WHERE id = '${receivingUser.id}'`, async (err, rows) => {
            if(err) throw err;
            let sql;
            if(rows.length < 1) {
                let uCoins = 0;

                let coinEmbed = new Discord.RichEmbed()
                .setAuthor(receivingUser.displayName, receivingUser.user.avatarURL, receivingUser.user.avatarURL)
                .addField("💸", `\`${uCoins} ${client.cfg.curName}\`!`)
                .setColor("#00FF00")
                .setFooter(`This user has never received or spent any money, what a Lurker`)
                if(receivedMessage.content.toLowerCase().includes("dogecoin")) coinEmbed.setThumbnail("https://i.imgur.com/aUSiZ12.png")

                receivedMessage.channel.send({embed: coinEmbed})
            } else {
                let uCoins = rows[0].coins;
                function numComma(x) {
                    var parts = x.toString().split(".");
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return parts.join(".");
                }

                function GetEntries(ID) {
                    return new Promise ((resolve, reject) => {
                        connection.query("SELECT CASE WHEN ((SELECT COUNT(*) FROM usercoinchange WHERE UserID = '"+ID+"' AND DateChanged > NOW() - INTERVAL 1 MONTH) < 100) THEN ('SELECT DateChanged, Coins FROM usercoinchange WHERE UserID = \\'"+ID+"\\' ORDER BY DateChanged DESC LIMIT 100') ELSE ('SELECT DateChanged, Coins FROM usercoinchange WHERE UserID = \\'"+ID+"\\' AND DateChanged > NOW() - INTERVAL 1 MONTH ORDER BY DateChanged DESC') END INTO @test; PREPARE myQuery FROM @test; EXECUTE myQuery;DEALLOCATE PREPARE myQuery;", function (error, result, fields) {
                            if(error) {
                                reject(error);
                            } else if(result[2].length < 1) {
                                reject(0)
                            } else resolve(result[2]);
                        });
                    });
                }

                function getGraph(ID,Name,Color) {
                    return new Promise ((resolve, reject) => {
                        var highestAmt = 0
                        var lowestAmt = Infinity
                        GetEntries(ID).then(function(value) {
                            var ChangeArray = value;
                            var DatesArray = [];
                            var CoinsArray = [];
                            if(ChangeArray.lenght < 1) {
                                return reject(0)
                            };
                            ChangeArray.forEach(ChangeItem => {
                                if(ChangeItem.DateChanged > Date.now() - time) {
                                    if(ChangeItem.Coins > highestAmt) highestAmt = ChangeItem.Coins;
                                    if(ChangeItem.Coins < lowestAmt) lowestAmt = ChangeItem.Coins;
                                    DatesArray.push(ChangeItem.DateChanged);
                                    CoinsArray.push(ChangeItem.Coins);
                                }
                            });
                            var whileplus = 0
                            if(DatesArray.length < 1) {
                                DatesArray.unshift(new Date(Date.now()).toISOString());
                                whileplus += 5000;
                            } 
                            while(DatesArray.length < 2) {
                                DatesArray.unshift(new Date(Date.now() + whileplus).toISOString());
                                CoinsArray.unshift(ChangeArray[0].Coins);
                                whileplus += 5000
                            }


                            var trace1 = {
                                x: DatesArray,
                                y: CoinsArray,
                                fill: "tonexty",
                                type: "scatter",
                                name: Name,
                                marker:{
                                    color: Color 
                                }
                            };

                            var graphtitle = time == Infinity ? `${receivingUser.user.tag.replace(/[^\x00-\x7F]/gi, "")}'s ${client.cfg.curName} over time` : `${receivingUser.user.tag.replace(/[^\x00-\x7F]/gi, "")}'s ${client.cfg.curName} over the past ${prettyMs(time, {compact: true, verbose: true})}`
                            var figure = { 'data': [trace1],layout: {
                                paper_bgcolor: 'rgba(28,28,28,1))',
                                plot_bgcolor: 'rgba(0,0,0,0)',
                                title: graphtitle,
                                showlegend: true,
                                legend: {
                                    x: 1,
                                    y: 1
                                },
                                font: {
                                    family: "Courier New, monospace",
                                    size: 24,
                                    color: "#DBDBDB"
                                },
                                
                                xaxis: {
                                    range: [DatesArray[DatesArray.length-1], DatesArray[0]],
                                    showgrid: true,
                                    zeroline: false,
                                    showline: true,
                                    gridcolor: "#919191",
                                    gridwidth: 2,
                                    linecolor: "#636363",
                                    linewidth: 6,

                                    title: "Time",
                                    titlefont: {
                                        family: "Arial, sans-serif",
                                        size: 22,
                                        color: "lightgrey"
                                    },
                                    tickfont: {
                                        family: "Old Standard TT, serif",
                                        size: 14,
                                        color: "#CECECE"
                                    },

                                    autotick: false,
                                    ticks: "outside",
                                    tick0: 0,
                                    dtick: Math.round(((DatesArray[0] - DatesArray[DatesArray.length-1]) / xnodes) / Math.pow(10, Date.parse(DatesArray[0]).toString().length -7)) * Math.pow(10, Date.parse(DatesArray[0]).toString().length -7),
                                    ticklen: 4,
                                    tickwidth: 4,
                                    tickcolor: "#000"
                                    },

                                yaxis: {
                                    range: [lowestAmt, highestAmt],
                                    showgrid: true,
                                    zeroline: false,
                                    showline: true,

                                    gridcolor: "#919191",
                                    gridwidth: 2,
                                    linecolor: "#636363",
                                    linewidth: 6,

                                
                                    title: client.cfg.curName,
                                    titlefont: {
                                        family: "Arial, sans-serif",
                                        size: 18,
                                        color: "lightgrey"
                                    },
                                    tickfont: {
                                        family: "Old Standard TT, serif",
                                        size: 14,
                                        color: "#CECECE"
                                    },
                        
                                    autotick: false,
                                    ticks: "outside",
                                    tick0: 0,
                                    dtick: Math.round(((highestAmt - lowestAmt) / ynodes) / Math.pow(10, highestAmt.toString().length -2)) * Math.pow(10, highestAmt.toString().length-2),
                                    ticklen: 4,
                                    tickwidth: 4,
                                    tickcolor: "#000"
                                }
                            }};  
                            var imgOpts = {
                                format: 'png',
                                width: 2000,
                                height: 500,
                            };
                            plotly.getImage(figure, imgOpts, function (error, imageStream) {
                                if (error) reject(error);
                                resolve(imageStream);
                            });
                        }).catch(err => {
                            let coinEmbed = new Discord.RichEmbed()
                            .setAuthor(receivingUser.displayName, receivingUser.user.avatarURL, receivingUser.user.avatarURL)
                            .addField("💸", `\`${numComma(uCoins)} ${client.cfg.curName}\`!`)
                            .setColor("#00FF00")
                            .setFooter(`Not enough entries to draw a complete Graph!`)
                            .setTimestamp()
                            if(receivedMessage.content.toLowerCase().includes("dogecoin")) coinEmbed.setThumbnail("https://i.imgur.com/aUSiZ12.png")

                            return receivedMessage.channel.send({embed: coinEmbed})
                        })

                    });
                }
                getGraph(receivingUser.user.id, receivingUser.user.tag.replace(/[^\x00-\x7F]/gi, ""), receivingUser.displayHexColor).then(graph => {

                    var attachment = new Discord.Attachment(graph, "graph.png");
                    let coinEmbed = new Discord.RichEmbed()
                    .setAuthor(receivingUser.displayName, receivingUser.user.avatarURL, receivingUser.user.avatarURL)
                    .addField("💸", `\`${numComma(uCoins)} ${client.cfg.curName}\`!`)
                    .setColor("#00FF00")
                    .setFooter(`Graph of ${receivingUser.displayName}'s income over time`)
                    .setTimestamp()
                    .attachFile(attachment)
                    .setImage('attachment://graph.png');
                    if(receivedMessage.content.toLowerCase().includes("dogecoin")) coinEmbed.setThumbnail("https://i.imgur.com/aUSiZ12.png")

                    receivedMessage.channel.send({embed: coinEmbed})
                }).catch(err => {
                    let coinEmbed = new Discord.RichEmbed()
                    .setAuthor(receivingUser.displayName, receivingUser.user.avatarURL, receivingUser.user.avatarURL)
                    .addField("💸", `\`${numComma(uCoins)} ${client.cfg.curName}\`!`)
                    .setColor("#00FF00")
                    .setFooter(`Not enough entries to draw a complete Graph!`)
                    .setTimestamp()
                    if(receivedMessage.content.toLowerCase().includes("dogecoin")) coinEmbed.setThumbnail("https://i.imgur.com/aUSiZ12.png")

                    return receivedMessage.channel.send({embed: coinEmbed})
                })

            }

        })

    }
}

