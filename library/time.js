'use strict';
const matchSorter = require('match-sorter').default;

function plural(str, count)
{
    return `${str}${count == 1 ? '' : 's'}`;
};

class Unit
{
    constructor(name, definition, aliases)
    {
        this.name = name;
        this.definition = definition;
        this.aliases = aliases;
    };
};

class Time
{
    constructor(ms, opts)
    {
        let tMS = ms;
        const round = ms > 0 ? Math.floor : Math.ceil;

        this.eternity = (ms >= Number.MAX_VALUE) ? 1 : 0
        ms = this.eternity ? 0 : ms
        this.aeon = round(ms / 3.1536e+19)
        this.millenium = round(ms / 3.1536e+13) % 1000000;
        this.century = round(ms / 3.1536e+12 % 10);
        this.decade = round(ms / 3.1536e+11) % 10;
        this.year = round(ms / 3.1536e+10) % 10;
        this.day = round(ms / 86400000) % 365;
        this.hour = round(ms / 3600000) % 24;
        this.minute = round(ms / 60000) % 60;
        this.second = round(ms / 1000) % 60;
        this.millisecond = round(ms) % 1000;
        this.microsecond = round(ms * 1000) % 1000;
        this.nanosecond = round(ms * 1e6) % 1000;

        let str = ''
        let int = 0;
        let firstRelevant;

        for (const t in this)
        {
            if (!isFinite(this[t])) this[t] = 0;
            let unit = units.find(u => u.name == t)
            if (this[t] && (!firstRelevant || int < firstRelevant + opts.relevant))
            {
                str += `${this[t]}${opts.verbose ? " " + plural(t, this[t]) : unit.aliases[0]}, `;
                if (!firstRelevant) firstRelevant = int;
            };
            int++;
        };

        this.ms = isFinite(tMS) ? tMS : Number.MAX_VALUE;
        this.str = str.replace(/, ([^,]*)$/, '').replace(/, ([^,]*)$/, ' and $1');
        this.toString = function ()
        {
            return this.str;
        };
        this.valueOf = function ()
        {
            return this.ms;
        }
    };
};
const units = [
    new Unit('eternity', Number.MAX_VALUE, ['eternity', 'eternities']),
    new Unit('aeon', 3.1536e+19, ['ae', 'æ', 'aeons', 'eon', 'eons']),
    new Unit('millenium', 3.1536e+13, ['ml', 'milleniums', 'millennia']),
    new Unit('century', 3.1536e+12, ['l', 'cent', 'centurys', 'centuries']),
    new Unit('generation', 1103760000000, ['generations']),
    new Unit('decade', 3.1536e+11, ['dc', 'decades']),
    new Unit('megaminute', 60000000000, ['megaminutes']),
    new Unit('year', 3.1536e+10, ['y', 'yr', 'yrs', 'years']),
    new Unit('season', 7884086400, ['quarter', 'trimonth']),
    new Unit('month', 2628028800, ['mo', 'mon', 'months']),
    new Unit('lunar month', 2449440000, ['lunarmonth', 'lunarmonths']),
    new Unit('fortnight', 1209600000, ['biweek', 'fortnights', 'biweeks', 'fortnite']),
    new Unit('week', 604800000, ['w', 'weeks']),
    new Unit('day', 86400000, ['d', 'days']),
    new Unit('hour', 3600000, ['h', 'hr', 'hrs', 'hours']),
    new Unit('moment', 90000, ['moments']),
    new Unit('minute', 60000, ['m', 'mn', 'min', 'mins', 'minutes']),
    new Unit('instant', 8000, ['in', 'instants']),
    new Unit('second', 1000, ['s', 'sec', 'secs', 'seconds']),
    new Unit('millisecond', 1, ['ms', 'msec', 'msecs', 'milliseconds']),
    new Unit('microsecond', 0.001, ['µs', 'micro', 'micros', 'microsec', 'microsecs', 'microseconds']),
    new Unit('nanosecond', 0.000001, ['ns', 'nano', 'nanos', 'nanosec', 'nenosecs', 'nanoseconds'])
];
/**Converts a string of time units into milliseconds
 * @param  {String} str
 * @param  {Boolean} verb
 * @param  {Number} cl
 * 
 * @return {Time}
 */
function convertStringToMs(str = '', verb = true, cl = null, strictMode = false)
{
    let verbose = !!verb
    let relevant = cl || 2;
    var opts = {
        verbose,
        relevant
    };
    str = str.toLowerCase().replace(/[^a-z0-9.]+/gi, '');
    var ms = 0;
    var cycle = 0;
    while (str.length)
    {

        cycle++;
        if (cycle > 10) break;

        var sepArg = str.match(/[a-zæ]+|[0-9.\-]+/gi);
        if (!sepArg) return null;
        if (sepArg.length == 1)
        {
            if (strictMode) return null;

            if (sepArg[0].toString().match(/[a-zæ]+/gi))
            {
                sepArg[1] = sepArg[0];
                sepArg[0] = "1";
            } else
            {
                sepArg[1] = "m";
            };
        };
        if (sepArg[1].match(/[^a-zæ]/gi) || sepArg[0].match(/[^0-9.\-]/g)) continue;

        var from = units.find(u => u.name == sepArg[1]) || units.find((u) => u.aliases.includes(sepArg[1]));
        if (!from)
        {
            let uNames = [];
            units.forEach(u =>
            {
                uNames.push(...[u.name, ...u.aliases]);
            });
            var matches = matchSorter(uNames, sepArg[1]);
            if (!matches.length) continue;
            var from = units.find(u => u.name == matches[0] || u.aliases.includes(matches[0]));
        };
        ms += parseFloat(sepArg[0]) * from.definition;
        str = str.substr(sepArg[0].length + sepArg[1].length);
    };
    if (!ms) return void 0;
    return new Time(ms, opts);
};

/**Converts time
 * @param  {Number} ms Time in milliseconds
 * @param  {Boolean} verb whether or not to display a verbose version of the units, s => seconds, h => hours, etc
 * @param  {Number} cl how many lower values to ignore
 * 
 * @return {Time} the time object, read the .str property for a string
 */
var time = function (ms, verb = true, cl)
{
    let verbose = !!verb
    let relevant = cl || 2;
    var opts = {
        verbose,
        relevant
    };
    return new Time(ms, opts);
}
var Obj = Object.create(Function.prototype);
Obj.fromString = convertStringToMs;
Obj.Class = Time;
Object.setPrototypeOf(time, Obj);

module.exports = time;