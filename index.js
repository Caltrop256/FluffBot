'use strict';

var forever = require('forever-monitor');
var main = new (forever.Monitor)('main.js', {
    logFile: './logs/log.txt',
    outFile: './logs/out.txt',
    errFile: './logs/err.txt',
    max: 999,
    silent: false,
    killTree: true,
    minUptime: 2000,
    spinSleepTime: 1000
});
main.on('exit:code', function (code) {
    if (!code)
        return console.error('[Forever-Monitor] Main module restarting.');
    console.error('[Forever-Monitor] Main module forcefully shutting down.');
    main.stop();
});
main.start();
var cleanExit = function () { main.stop(); };
try {
    ['SIGTERM', 'SIGINT', 'SIGQUIT', 'SIGKILL', 'SIGHUP'].forEach((signal) => process.on(signal, cleanExit));
}
catch
{
    console.log('heck');
}
