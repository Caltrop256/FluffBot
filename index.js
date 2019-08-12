var forever = require('forever-monitor');
var main = new (forever.Monitor)('main.js', {
    logFile: './logs/main.txt',
    max: 999,
    silent: false,
    killTree: true,
    minUptime: 2000,
    spinSleepTime: 1000, 
    args: []
});

main.on('exit', function () {
    console.log('main module has exited.');
});

main.start();

/*
        DEBUG
*/

main.on('watch:restart', function(info) {
    console.error('Restaring main module because ' + info.file + ' changed');
});

main.on('restart', function() {
    console.error('Forever restarting main module for the ' + main.times + ' time');
});

main.on('exit:code', function(code) {
    console.error('Forever detected main module exited with code ' + code);
});

process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
  });
