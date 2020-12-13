'use strict'
const config = require(process.env.tropbot + '/config.json');
const Discord = require('discord.js');
const mysql = require('mysql');
const syncMySQL = require('sync-mysql');
const internal = require('stream');

var distance = require("leven");

module.exports = {
    /**
     * Checks if type of variable matches type specified, crashes if false and reject is specified or throws reject if specified
     * @param {Object} selectedObj The object to check 
     * @param {Object} selectedType The type to compare with
     * @param {(reason:Object)=>void} [reject] The reject callback function 
     * @param {String} [objName] The name of the variable  
     * @return {Boolean} The result of the comparison
     * @throws {TypeError} Thrown if reject is specified and return value is false
     * @example 
     * typeCheck('Hello',String) //returns true 
     * typeCheck('Hello',Number) //returns false
     * typeCheck('Hello',Number,reject) //throws error
     */
    typeCheck(selectedObj, selectedType, reject, objName)
    {
        let result = (selectedObj instanceof selectedType) || (typeof selectedObj == selectedType.name.toLowerCase());
        if (!result && reject)
            throw reject(new TypeError(`Invalid Type for ${objName ? objName : 'variable'} (Expected ${selectedType.name}, got ${selectedObj.constructor.name})`));
        return result;

    },
    /**
     * Checks if type of variable matches one of types specified, crashes if false and reject is specified or throws reject if specified
     * @param {Object} selectedObj The object to check 
     * @param {Array} selectedTypes The types to compare with
     * @param {(reason:Object)=>void} [reject] The reject callback function 
     * @param {String} [objName] The name of the variable  
     * @return {Boolean} The result of the comparison
     * @throws {TypeError} Thrown if reject is specified and return value is false
     * @example 
     * typeCheckM(1234,[String,Number]) //returns true 
     * typeCheckM('Hello',[String,Number]) //returns true 
     * typeCheckM(true,[String,Number]) //returns false
     * typeCheckM(true,[String,Number],reject) //throws error
     */
    typeCheckM(selectedObj, selectedTypes, reject, objName)
    {
        let result = false;
        for (let selectedType of selectedTypes)
            result |= (selectedObj instanceof selectedType) || (typeof selectedObj == selectedType.name.toLowerCase());
        if (!result && reject)
            throw reject(new TypeError(`Invalid Type for ${objName ? objName : 'variable'} (Expected ${endListWithAnd(selectedTypes, true)}, got ${selectedObj.constructor.name})`));
        return result;
    },
    /**escapes or removes common Discord markdown
     * @param  {String} str Input text
     * @param  {Boolean} remove Whether or not to escape or remove markdown, false = escape
     * @return {String} The clean string
     */
    escapeMarkdown(str, remove)
    {
        return remove ?
            str.replace(/\\(\*|_|`|~|\||\\)/g, '$1').replace(/(\*|_|`|~|\||\\)/g, '') :
            str.replace(/\\(\*|_|`|~|\||\\)/g, '$1').replace(/(\*|_|`|~|\||\\)/g, '\\$1')
    },
    /**converts rgb value components to hex codes
     * @param  {Number} c
     */
    componentToHex(c)
    {
        return c.toString(16).length == 1 ?
            "0" + c.toString(16) :
            c.toString(16);
    },

    /**converts rgb color codes to hex
     * @param  {Array} rgb in order of red, green, blue
     * @return {String} The hex code
     */
    rgbToHex(rgb)
    {
        return this.componentToHex(Math.round(rgb[0])) + this.componentToHex(Math.round(rgb[1])) + this.componentToHex(Math.round(rgb[2]));
    },

    /**converts hex codes to rgb color codes
     * @param  {String} hex the hex value to convert
     * @return {Array} the rgb values, sorted by red, green, blue
     */
    hexToRGB(hex)
    {
        return [parseInt(hex, 16) >> 16, (parseInt(hex, 16) >> 8) & 255, parseInt(hex, 16) & 255];
    },

    /**creates a random hex color code
     * @return {String} the random hex code
     */
    randomColor()
    {
        return ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6)
    },

    /**returns a random boolean given a certain percentile chance
     * @param  {Number} c the chance that the result will be true in percent, defaults to 50
     * @return {Boolean} the resulting random boolean
     */
    randBool(c)
    {
        return (Math.random() * 100) < (c || 50);
    },

    /**Adds the corresponding suffix to the ordinal number, for example: 1st, 2nd, 3rd, 12th
     * @param  {Number} n the number to be suffixed
     * @return {String} the resulting suffixed number
     */
    ordinalSuffix(n)
    {
        let a = n.toString();
        n %= 100;
        return a + (Math.floor(n / 10) === 1 ?
            'th' :
            (n % 10 === 1 ?
                'st' :
                (n % 10 === 2 ?
                    'nd' :
                    (n % 10 === 3 ?
                        'rd' :
                        'th'))));
    },

    /**Measures how many characters 2 strings have in common at the same position
     * @param  {String} a the first string
     * @param  {String} b the second string
     * @return {Number} Similarity of the 2 strings on a scale from 0 to 1
     */
    similarity(a, b)
    {
        return (Math.max(a.length, b.length) - distance(a.toLowerCase(), b.toLowerCase())) / Math.max(a.length, b.length)
    },

    /**stops the execution of lower code
     * @param  {Number} ms the amount of ms to pause
     * @return {Promise}
     */
    wait(ms)
    {
        return new Promise(resolve =>
        {
            setTimeout(resolve, ms);
        });
    },

    numComma(n)
    {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    numAbbr(num, fixed = 1)
    {
        var b = (num).toPrecision(2).split("e"), // get power
            k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
            c = k < 1 ? num.toFixed(fixed) : (num / Math.pow(10, k * 3)).toFixed(fixed), // divide by power
            d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
            e = d + ['', 'k', 'm', 'b', 't'][k]; // append power
        return e;
    },

    /**removes duplicated elements from an array
     * @param  {Array} arr
     * @return {Array} the array with each duplicate of an element removed
     */
    removeDuplicateElements(arr)
    {
        return [...new Set(arr)];
    },

    /**Checks if an array contains all elements of another array
     * @param  {Array} a the array to check for
     * @param  {Array} t the array to target
     * @param  {Boolean} r whether or not to return missing elements
     * @return {Boolean} whether or not the array to check for included all elements or not
     */
    containsAllElements(a, t, r)
    {
        if (r)
        {
            let missing = [];
            t.forEach(e =>
            {
                if (!a.includes(e)) missing.push(e)
            });
            return missing;
        } else return t.every(e => a.includes(e));
    },

    /**calculates the average of a multiple of numbers
     * @param  {Array} arr the numbers to average
     * @return {Number} the average
     */
    average(arr)
    {
        return arr.map((c, i, arr) => c / arr.length).reduce((p, c) => c + p);
    },

    /**randomly sorts all elements in an array
     * @param  {Array} arr the array to shuffle
     * @return {Array} the shuffled array
     */
    shuffle(arr)
    {
        return arr.sort((a, b) => 0.5 - Math.random());
    },
    /**takes an array of strings and returns the length of the longest string
     * @param  {Array} arr the array of strings
     * @return {Number} length of the longest string
     */
    lengthOfLongest(arr)
    {
        arr = arr.map(n => n = n.length);
        return Math.max(...arr);
    },
    /**Adds a 'and' at the end of a comma seperated list
     * @param  {Array} arr array of strings
     * @param  {Boolean} useOr end the list with an "or" instead of an "and"
     * @return {String}
     */
    endListWithAnd(arr, useOr)
    {
        return arr.join(", ").replace(/, ([^,]*)$/, ` ${useOr ? 'or' : 'and'} $1`);
    },

    sqlConnections: 0,
    /**creates a mySQL connection
     * @param  {Boolean} multiStatements whether to allow multiple statements in a query or not, defaults to false
     * @param  {Boolean} preventClose whether to prevent automatically closing connection, defaults to false. ONLY USE WHEN ABSOLUTELY NECESSARY!!
     * @return {Object} the mySQL connection
     */
    getSQL(multiStatements, preventClose = false)
    {
        if (this.sqlConnections >= 100) throw new Error('Too many connections');
        var connection = mysql.createConnection({
            host: config.useLocal ? `localhost` : config.mySQLHost,
            port: config.useLocal ? `3306` : config.mySQLPort,
            user: config.mySQLuser,
            password: config.mySQLPassword,
            database: config.mySQLdb,
            multipleStatements: multiStatements || false
        });
        connection.on('end', () =>
        {
            this.sqlConnections--;
        });
        connection.on('error', (err) =>
        {
            if (err.code !== 'PROTOCOL_CONNECTION_LOST')
                console.log('[SQL] ', err)
        });
        if (!preventClose)
        {
            this.sqlConnections++;
            setTimeout(() =>
            {
                if (connection.state !== 'disconnected')
                    connection.end();
            }, 20000)
        }
        return connection;
    },

    /**creates a synced mySQL connection
     * @deprecated may be deleted unless a use is found for a thread blocking sql connection
     * @param  {Boolean} multiStatements wether to allow multiple statements in a query or not, defaults to false
     * @return {Object} the synced mySQL connection
     */
    getSyncSQL(multiStatements)
    {
        return new syncMySQL({
            host: config.useLocal ? `localhost` : config.mySQLHost,
            port: config.useLocal ? `3306` : config.mySQLPort,
            user: config.mySQLuser,
            password: config.mySQLPassword,
            database: config.mySQLdb,
            multipleStatements: multiStatements || false
        });
    },
    /**creates a Discord Attachment object
     * @param {String|Buffer|internal.Stream} file
     * @param {String} name
     * @return {Discord.Attachment} 
     */
    getAttachment(file, name = null)
    {
        return new Discord.Attachment(file, name);
    },

    /**creates a Discord Collection object
     * @param {Map} entries
     * @return {Discord.Collection} the Collection
     */
    getCollection(entries = null)
    {
        return new Discord.Collection(entries);
    },

    /**creates a Discord Embed object
     * @return {Object} the embed
     */
    getEmbed()
    {
        return new Discord.RichEmbed();
    },

    /**converts a Discord Permission bitfield into an array of strings of the permission name
     * @param  {Number} bitfield
     * @return {Array} array of strings of permission names
     */
    decodePermBitfield(bitfield)
    {
        let flagsArr = []
        for (let flag in Discord.Permissions.FLAGS)
        {
            if ((Discord.Permissions.FLAGS[flag] & bitfield) == Discord.Permissions.FLAGS[flag]) flagsArr.push(flag);
        }
        return flagsArr;
    },

    /**Gets a User's Access Rights
     * @param  {TropBot} client
     * @param  {GuildMember} member
     */
    getPerms(client, member)
    {
        let perms = this.decodePermBitfield(member.permissions.bitfield);
        if (member.id == member.guild.ownerID) perms.push('GUILD_OWNER');
        if (member.id == client.constants.botInfo.developers[0]) perms.push('BOT_OWNER');
        for (const dev of client.constants.botInfo.developers)
        {
            if (dev == member.id) perms.push('DEV');
        };

        return perms;
    },
    isSuspect(user, client)
    {
        let member = client.guilds.get('562324876330008576').member(user);
        if (member && member.nickname && (client.swearDetect(member.nickname).replaced || this.containsQuestionableWords(member.nickname))) return true;
        if (client.swearDetect(user.username).replaced || this.containsQuestionableWords(user.username)) return true;
        return (!user.avatarURL || user.createdTimestamp > Date.now() - 259200000);
    },
    containsQuestionableWords(str)
    {
        return /(\bcum+)|(\bqueef\b)|(fuc(c|k)er)/gim.test(str || '');
    },
    /**Gets any image attachments or image urls in embeds from a message
     * @param  {Message} msg The message to get the image from
     * @return {String} The URL
     */
    getImage(msg)
    {
        let eURL = '';
        const attArr = msg.attachments.array();
        const embeds = msg.embeds;
        for (let j = 0; j < embeds.length; j++)
        {
            let e = embeds[j];
            if (e.footer && e.footer.iconURL) eURL = e.footer.iconURL;
            if (e.author && e.author.iconURL) eURL = e.author.iconURL;
            if (e.video && e.video.url) eURL = e.video.url;
            if (e.thumbnail && e.thumbnail.url) eURL = e.thumbnail.url;
            if (e.image && e.image.url) eURL = e.image.url;
        };
        for (let i = 0; i < attArr.length; i++)
        {
            if (attArr[i].height) eURL = attArr[i].url
        };
        return eURL;
    },
    /**
     * @param  {TropBot} client
     * @param  {String} s The message link
     * @return {TextMessage} The message object
     */
    async getMessageFromLink(client, s)
    {
        let sA = s.match(/[0-9]+/g);
        return await client.channels.get(sA[1]).fetchMessage(sA[2]);
    },

    /**
     * @return {Promise} updated cfg values
     */
    getCfg()
    {
        return new Promise((resolve, reject) =>
        {
            var connection = this.getSQL();
            var cfg = new Object();
            connection.query(`SELECT * FROM config;`, (err, configs) =>
            {
                if (err)
                    return reject(err);
                configs.forEach(config =>
                {
                    cfg[config.key] = config.value
                });
                cfg.prefix = [config.useBeta ? '+$' : '$'];

                connection.query(`SELECT * FROM prefixes;`, (err, prefixes) =>
                {
                    if (err)
                        return reject(err);
                    prefixes.forEach(prefix =>
                    {
                        cfg.prefix.push(prefix.prefix);
                    });
                    resolve(cfg);
                });
            });
        });
    }
};