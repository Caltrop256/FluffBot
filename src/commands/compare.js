const Discord = require('discord.js');
const config = require("./json/config.json");
const plotly = require('plotly')(config.pName,config.pToken);
const replaceColor = require('replace-color')
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
    name: 'compare',
    aliases: ['moneycompare'],
    description: `Compares the amount of money between 2 users.`,
    args: true,
    usage: '<users>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    async execute(client, arguments, receivedMessage) {
        var id = new Array();
        var name = new Array();
        var color = new Array();

        var mention = new Array();

        if(arguments.length < 2) arguments[1] = `${receivedMessage.author.id}`
        for(var i = 0; i < arguments.length; i++) { 
            let member = client.getMemberFromArg(receivedMessage, arguments, i, false, true)
            if(member) {
                id.push(member.user.id);
                name.push(member.user.tag.replace(/[^\x00-\x7F]/gi, ""));
                color.push(member.displayHexColor);
                mention.push(member.toString())
            };
        };
        if(id.length < 2) return receivedMessage.reply(`Please provide at least 1 user to compare yourself too!`)


        function GetEntries(ID) {
            return new Promise ((resolve, reject) => {
                connection.query("SELECT CASE WHEN ((SELECT COUNT(*) FROM usercoinchange WHERE UserID = '"+ID+"' AND DateChanged > NOW() - INTERVAL 1 MONTH) < 100) THEN ('SELECT DateChanged, Coins FROM usercoinchange WHERE UserID = \\'"+ID+"\\' ORDER BY DateChanged DESC LIMIT 100') ELSE ('SELECT DateChanged, Coins FROM usercoinchange WHERE UserID = \\'"+ID+"\\' AND DateChanged > NOW() - INTERVAL 1 MONTH ORDER BY DateChanged DESC') END INTO @test; PREPARE myQuery FROM @test; EXECUTE myQuery;DEALLOCATE PREPARE myQuery;", function (error, result, fields) {
                    console.log
                    if(error) {
                        reject(error);
                    } else resolve(result[2]);
                });
            });
        }

        async function getUserMoney(id) {
            return new Promise((resolve, reject) => {
                connection.query(`SELECT * FROM coins WHERE id = '${id}'`, async (err, rows) => {
                    if(err) reject(err);
                    if(rows.length < 1) {
                        resolve(0)
                    } else resolve(rows[0].coins)
                })
            })
        }

        async function getGraphs(IDArray,NameArray,ColorArray) {
            var UserGraphTraceArray = [];
            var highestAmt = 0
            var lowestAmt = Infinity
            for(var i = 0; i < IDArray.length; i++) {
                var ChangeArray = await GetEntries(IDArray[i]);
                var DatesArray = [];
                var CoinsArray = [];
                if(ChangeArray.length < 1) ChangeArray.push({DateChanged: Date.UTC() - 5000, Coins: await getUserMoney(IDArray[i])})
                ChangeArray.forEach(ChangeItem => {
                    if(ChangeItem.Coins > highestAmt) highestAmt = ChangeItem.Coins
                    if(ChangeItem.Coins < lowestAmt) lowestAmt = ChangeItem.Coins
                    DatesArray.push(ChangeItem.DateChanged);
                    CoinsArray.push(ChangeItem.Coins);
                });
                DatesArray.unshift(Date.UTC());
                CoinsArray.unshift(ChangeArray[0].Coins);
                UserGraphTraceArray.push({
                    x: DatesArray,
                    y: CoinsArray,
                    type: "scatter",
                    name: NameArray[i],
                    marker:{
                        color: ColorArray[i] 
                    }
                });
            }
            var figure = { 'data': UserGraphTraceArray,layout: {
                paper_bgcolor: 'rgba(28,28,28,1))',
                plot_bgcolor: 'rgba(0,0,0,0)',
                title: `Comparison between ${id.length} user's ${client.cfg.curName}`,
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

                        autotick: true,
                        ticks: "outside",
                        tick0: 0,
                        dtick: 0.25,
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
                        dtick: Math.round(((highestAmt - lowestAmt) / 7) / Math.pow(10, highestAmt.toString().length -2)) * Math.pow(10, highestAmt.toString().length-2),
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

            return new Promise ((resolve, reject) => {
                plotly.getImage(figure, imgOpts, function (error, imageStream) {
                    if (error) reject(error)
                    resolve(imageStream)
                });
            })
        }

        if(mention.length > 5) {
            mention[5] = `${mention.length - 5} others`
            mention.length = 5;
        }
        
        getGraphs(id, name, color).then(graph => {
            var attachment = new Discord.Attachment(graph, "graph.png");
            let coinEmbed = new Discord.RichEmbed()
            .setAuthor(`Wealth Comparison`)
            .setDescription(`Below you will see the wealth of ${mention.join(", ").replace(/, ([^,]*)$/, ' and $1')}.`)
            .setColor("#00FF00")
            .setTimestamp()
            .attachFile(attachment)
            .setImage('attachment://graph.png');

            receivedMessage.channel.send({embed: coinEmbed})
        })
    }
}