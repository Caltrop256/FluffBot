'use strict'
var Discord = require('discord.js')
var fs = require('fs');
const connect = require('connect');
const serveStatic = require('serve-static');
class TropBot extends Discord.Client {
    constructor(useLocal,useBeta) {
        super({
            disableEveryone: true,
            fetchAllMembers: true,
            messageCacheMaxSize: -1
        });
        this.useBeta = useBeta;
        this.useLocal = useLocal;
        //this.root = _dirname.toString().replace(/\\([^\\]*)$/, "");
        this.startUp = Date.now();
        this.constants = require('./constants.js');
        this.scripts = require('./scripts.js');
        this.https = require('./HTTPSHelper.js');

        this.lastErr = new Array();
        this.hasInit = false;
        //this.getMember = require('./getMember.js');
        //this.getChannel = require('./getChannel.js');
        //this.getRole = require('./getRole.js');

        this.time = require('./time.js')


        var moduleFolders = fs.readdirSync('./modules');
        let arr = this.scripts.getCollection();
        for (const moduleFolder of moduleFolders) {
            var moduleFile = require(`../modules/${moduleFolder}/index.js`);
            arr.set(moduleFile.name, moduleFile);
        };
        this.modules = arr.sort((a, b) => b.priority - a.priority);
        this.cooldowns = this.scripts.getCollection();
        this.polls = this.scripts.getCollection();
        this.lastSeenCollec = this.scripts.getCollection();
        this.userKarma = this.scripts.getCollection();
        this.starboard = this.scripts.getCollection();
        this.invites = {};

        this.root = process.env.tropbot;
        if (this.useBeta) {
            this.replClient = connect().use(serveStatic('./library/html')).listen(9187, function() {
                console.log('REPL Client running on 9187...');
            });
            this.startREPLServer();
        }

    };

    /**Initialises all modules and logs into the client account
     * @param  {String} t the bot account token
     * @return {Promise} itself
     */
    async Init(t) {
        this.cfg = await this.scripts.getCfg();

        var updamt = this.modules.size;
        var cycles = 0;
        var updbar = '';

        for (var [i, m] of this.modules) {
            console.log(await m.Init(this));

            updbar += '█';
            cycles += 1;
            let ETA = (((Date.now() / cycles) - (this.startUp / cycles)) * (updamt - cycles)) / 1000;
            //console.clear();
            var info = `Initialized ${cycles}/${updamt} (${(cycles / updamt * 100).toFixed(1)}%) modules! \nLatest: ${m.name}\n[${updbar.padEnd(updamt)}]\nETA: ${ETA.toFixed(1)}s`
            console.log(info);
            if (this.useBeta)
                this.REPLServer.broadcast('loading', info);
        };
        super.login(t);
        if (this.useBeta) {
            this.hasInit = true;
            this.REPLServer.isReady = true;
            this.REPLServer.broadcast('info', 'ready');
        }
        return this;
    };
    startREPLServer() {
        this.REPLServer = require('./REPL.js');
        console.log('Initializing REPL server');
        this.REPLServer.isReady = this.hasInit;
        this.REPLServer.init(this);

    }
};
module.exports = TropBot;