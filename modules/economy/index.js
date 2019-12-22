'use strict';
/*
    reject codes:
    1 : no coins entry
    2 : no entries
    3 : not enough entries
    4 : sql error
    5 : plot.ly error
    6 : successfully got trace (getTraces only)
    [Object object] : unhandled exception
*/
module.exports = require(process.env.tropbot + '/genericModule.js');
module.exports.Info({
    name: 'economy',
    desc: ''
});

const config = require(process.env.tropbot + '/config.json')
const plotly = require('plotly')(config.pName, config.pToken);

class MoneyInfo {
    constructor(ID, coins = null, entries = []) {
        this.ID = ID;
        this.coins = coins ? parseInt(coins) : 0;
        this.entries = entries;
        this.hasEntry = coins !== null
        this.hasEntries = !!entries.length
    };
};
// make sure to check out merch monday I'm taking 25% off all my dope hoodies
module.exports.ModuleSpecificCode = function(client) {
        function updateMoney(userID, amount, setMoney = false) {
            return new Promise((resolve, reject) => {
                var connection = client.scripts.getSQL(true);
                client.getMoney(userID).then(u => {
                    let DateChanged = new Date(Date.now());
                    //let ID = u.id;
                    let Value = setMoney ? amount : u.coins + amount;
                    let sql = (amount || setMoney) ? `INSERT INTO \`usercoinchange\` (\`DateChanged\`, \`userID\`, \`Coins\`) VALUES ('${DateChanged.toISOString()}', '${userID}', '${Value}');` : '';
                    sql += u.hasEntry ?
                        `UPDATE coins SET coins = ${Value} WHERE id = '${userID}'` :
                        `INSERT INTO coins (id, coins) VALUES ('${userID}', ${Value})`;

                    connection.query(sql, (err, rows) => {
                        connection.end();
                        if (err) {
                            console.log(err, err.stack);
                            return reject(4);
                        }
                        //if(!rows) return reject('No such user'); //what
                        return resolve(rows[1].coins);
                    });
                }).catch(err => {
                    console.log(err, err.stack);
                    reject(err);
                })
            });
        };

        function getTotalMoney() //i gotta do more caching, the poor sql server :c
        {
            return new Promise((resolve, reject) => {
                var connection = client.scripts.getSQL();
                connection.query('SELECT SUM(coins) total FROM coins', (err, rows) => {
                    connection.end();
                    if (err) return reject(err);
                    resolve(rows[0].coins);
                });
            });
        }

        function getMoney(ID, getEntries = false, afterDate = null) {
            var connection = client.scripts.getSQL(getEntries);
            return new Promise((resolve, reject) => {
                        var SQL = `SELECT * FROM coins WHERE ID = '${ID}';`
                        SQL += getEntries ? `SELECT * FROM usercoinchange WHERE UserID = '${ID}'${afterDate ? ` AND DateChanged > '${afterDate.toISOString()}'` : ''}  ORDER BY \`DateChanged\` DESC` : '';
            connection.query(SQL, (err, rows) => {
                connection.end();
                if(err) {
                    console.log(err,err.stack);
                    reject(4);
                }
                var coinsResult = getEntries ? rows[0] : rows
                resolve( 
                    new MoneyInfo(ID,coinsResult.length ? coinsResult[0].coins : null,rows[1] ? rows[1] : []) //i really gotta make it auto create one
                );
            })
        })
    }
    function getTrace(ID,name,color,hasBackground,time = null) {
        return new Promise ((resolve, reject) => {
            var highestAmt = 0
            var lowestAmt = Infinity
            client.getMoney(ID, true ,time ? new Date(Date.now() - time) : null).then((moneyInfo) => {
                if(!moneyInfo.hasEntry)
                    return reject(1);
                var ChangeArray = moneyInfo.entries;
                var DatesArray = [];
                var CoinsArray = [];
                if(!ChangeArray.length)
                    return reject(2)
                if(ChangeArray.length < 1)
                    return reject(3)
                
                ChangeArray.forEach(ChangeItem => {
                        DatesArray.push(ChangeItem.DateChanged);
                        CoinsArray.push(ChangeItem.Coins);
                });
                DatesArray[0] = new Date();
                var trace = {
                    x: DatesArray,
                    y: CoinsArray, 
                    fill: hasBackground ? "tonexty" : "none",
                    type: "scatter",
                    name: name,
                    marker:{
                        color: color 
                    }
                };
                resolve(trace);
            }).catch(err => {
                console.log(err.stack);
                reject(4);
            })

        });
    };
    async function getTraces(IDArray,NameArray,ColorArray,time = null) {
        var UserGraphTraceArray = [];
        var resultCodes = [];
        for(var i = 0; i < IDArray.length; i++) {
            try
            {
                UserGraphTraceArray.push(await getTrace(IDArray[i],NameArray[i],ColorArray[i],false,time));            
                resultCodes.push(6);
            }
            catch(err)
            {
                if(typeof(err) != 'number') throw err;
                UserGraphTraceArray.push(null); 
                resultCodes.push(err);
            }
        }
        return {codes:resultCodes,traces:UserGraphTraceArray};
    }
    function getGraph(ID,name,color,graphTitle,xNodes,yNodes,hasBackground = false,time = null,padding = -1){
        return new Promise((resolve,reject) =>{
            client.getTrace(ID,name,color,hasBackground,time).then(trace =>
                client.graphTraces([trace],graphTitle,xNodes,yNodes,padding).then(graph => 
                    resolve(graph)
                ).catch(err =>{
                    if(typeof(err) != 'number') console.log(err,err.stack);
                    reject(err);
                })
            ).catch(err =>{
                if(typeof(err) != 'number') console.log(err,err.stack);
                reject(err);
            })
        });
    }
    function getGraphs(IDArray,NameArray,ColorArray,graphTitle,xNodes,yNodes,time = null,padding = -1){
        return new Promise((resolve,reject) =>{
            client.getTraces(IDArray,NameArray,ColorArray,time).then(traceResult =>{
                var codes = traceResult.codes;
                var successfulCodes = codes.filter(code => code == 6).length;
                if(!successfulCodes) reject(codes);
                var traces = traceResult.traces.filter(trace => trace !== null);
                client.graphTraces(traces,graphTitle,xNodes,yNodes,padding).then(graph => 
                    resolve({codes:codes,graph:graph})
                ).catch(err =>{
                    if(typeof(err) != 'number') console.log(err,err.stack);
                    reject(err);
                })
            }).catch(err =>{
                console.log(err,err.stack);
                reject(err);
            })
        });
    }
    function graphTraces(traceArray, graphTitle, xNodes, yNodes,padding = -1){
        return new Promise((resolve,reject) =>{
            //if(!traceArray.length) reject('length')
        var genericAxis =  {
            showgrid: true,
            zeroline: false,
            showline: true,
            gridcolor: "#919191",
            gridwidth: 2,
            linecolor: "#636363",
            linewidth: 6,
            titlefont: {
                family: "Arial, sans-serif",
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
            ticklen: 4,
            tickwidth: 4,
            tickcolor: "#000"
        }
        
        var {xAxis,  yAxis} = {xAxis:{...genericAxis},yAxis:{...genericAxis}};
        var lowestAmt = Infinity;
        var highestAmt = 0;
        var earliestDate = new Date(8640000000000000);
        var latestDate = new Date(-8640000000000000);
        traceArray.forEach(trace =>{
            trace.x.forEach(date =>{
                if(date > latestDate) latestDate = date;
                if(date < earliestDate) earliestDate = date;
            });
            trace.y.forEach(coins =>{
                if(coins > highestAmt) highestAmt = coins;
                if(coins < lowestAmt) lowestAmt = coins;
            });
        });
        padding = (padding < 0) ? Math.ceil((highestAmt - lowestAmt) * 0.1) : padding
        xAxis.titlefont.size = 22;
        xAxis = Object.assign(xAxis,{
            range: [earliestDate, latestDate], 
            title: "Time",
            dtick: /*(latestDate - earliestDate) / xNodes*/Math.round(((latestDate - earliestDate) / xNodes) / Math.pow(10, Date.parse(latestDate).toString().length -7)) * Math.pow(10, Date.parse(latestDate).toString().length -7)
        });
        
        yAxis.titlefont.size = 18;
        yAxis = Object.assign(yAxis,{
            range: [lowestAmt, highestAmt + padding],
            title: client.cfg.curName,
            dtick: /*(highestAmt - lowestAmt) / yNodes*/Math.round(((highestAmt - lowestAmt) / yNodes) / Math.pow(10, highestAmt.toString().length -2)) * Math.pow(10, highestAmt.toString().length-2)
        });

        var figure = { 
            'data': traceArray,
            layout: {
                paper_bgcolor: 'rgba(28,28,28,1))',
                plot_bgcolor: 'rgba(0,0,0,0)',
                title: graphTitle,
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
                xaxis: xAxis,
                yaxis: yAxis
        }};  
        var imgOpts = {
            format: 'png',
            width: 2000,
            height: 500,
        };
        plotly.getImage(figure, imgOpts, (error, imageStream) => {
            if (error) {
                console.log(error.stack);
                reject(5);
            }
            resolve(imageStream);
        });
    });
    }
    client.getTotalMoney = getTotalMoney;
    client.getMoney = getMoney;
    client.updateMoney = updateMoney;
    client.getTrace = getTrace;
    client.getTraces = getTraces;
    client.graphTraces = graphTraces;
    client.getGraph = getGraph;
    client.getGraphs = getGraphs;
};