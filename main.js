var Module = require('module');
console.color = require('colors');
const config = require('./config.json')
const path = require('path');
var TropBot = require('./library/TropBot.js')
const fs = require('fs');
var originalRequire = Module.prototype.require;
var lastRequire = null;
String.prototype.format = function (...args) {
    var toReturn = this.valueOf();
    for (var i = 0; toReturn.indexOf(`{${i}}`) != -1; i++) {
        toReturn = toReturn.replace(`{${i}}`, args[i]);
    }
    return toReturn;
}
errList = [];
client = {}
Module.prototype.require = function () {
    result = originalRequire.apply(this, arguments);
    try {
        var requirePath = path.join(this.id, '../', arguments[0]);
        if (!requirePath.includes('node_modules'))
            delete require.cache[fs.existsSync(requirePath) ? requirePath : require.resolve(arguments[0])];
    }
    catch (err) {
        errList.push(err);
    }
    finally {
        return result;
    }
};
Math.clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
}
String.prototype.oldReplace = String.prototype.replace;
String.prototype.replace = function (searchValue, replaceValue, oldReplace = false) {

    if (oldReplace || ((typeof (searchValue) != 'string') || (typeof (replaceValue) != 'string'))) return this.oldReplace(searchValue, replaceValue)
    var toReturn = this.valueOf();
    while (toReturn.indexOf(searchValue) != -1) {
        toReturn = toReturn.oldReplace(searchValue, replaceValue);
    }
    return toReturn;
}
process.env.tropbot = __dirname;

var client = new TropBot(config.useLocal, config.useBeta)
client.Init(config.useBeta ? config.betaToken : config.stableToken);
client.errList = errList;
process.on("uncaughtException", (err) => {
    if (err.message === 'Too many connections')
        return console.error(console.color.red(`[META]`), 'SQL Connection limit reached\n    ', err.stack.match(/\)\n( +?)at (.+?)\n/)[0].substring(1, 1000).trim());
    const errorMsg = err.stack; //.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error(console.color.red(`[META]`), console.color.red(`[Uncaught Exception]`), errorMsg);
    console.error(err.stack);
    console.color.red(`[META]`, `Shutting down...`);
    /*if(!config.useLocal) {
        logger.setLevel('fatal');
        logger.fatal(errorMsg);
    };*/
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});
process.on("unhandledRejection", err => {
    console.log(console.color.red(`[META]`), console.color.red(`[Uncaught Promise Error]`), err.message);
    client.lastErr.push(err);
});
if (client.useBeta) {
    process.on('exit', () => {
        client.destroy();
        client.replClient.close();
        client.REPLServer.stop();
    });
}