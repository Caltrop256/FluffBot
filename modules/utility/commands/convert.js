'use strict';

var convert = require(process.env.tropbot+'/library/cvUnits/index.js')
const matchSorter = require('match-sorter').default

module.exports = {
    name: 'convert',
    aliases: ['cv'],
    description: 'Converts Units',
    args: false,
    usage: '<Number+Unit | Possibilities> <Output Unit | best>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {

        if(!args.length) {
            var allUnits = client.scripts.getEmbed()
            .setAuthor(`Available Units`, message.author.displayAvatarURL)
            .setTimestamp()
            .setColor(message.member.displayHexColor)

            var categories = convert().measures()
            categories.forEach(c => {
                var units = convert().possibilities(c)
                allUnits.addField(c.replace(/([A-Z]+)/g, ' $1').replace(/^./gi, function(token){return token.toUpperCase()}), "`" + units.join("`, `").replace(/, ([^,]*)$/, ' and $1').replace(/2/gi, "²").replace(/3/gi, "³") + "`")
            })
            return message.channel.send({embed: allUnits})
        }

        var allUnits = convert().list()
        var allUnitsSingular = [];
        var allUnitsAbbr = convert().possibilities()

        allUnits.forEach(u => {
            allUnitsSingular.push(u.singular)
        })
        var sepArg1 = args[0].match(/[a-z/²³]+|[^a-z]+/gi)
        
        const findUnit = function(str) {
            var unit = null
            str = str.replace(/²/gi, "2").replace(/³/gi, "3");
            unit = allUnits.find(u => u.abbr.toLowerCase() == str.toLowerCase()) || allUnits.find(u => u.singular.toLowerCase() == str.toLowerCase()) || allUnits.find(u => u.plural.toLowerCase() == str.toLowerCase())
            if(!unit) {
                var singularMatches = matchSorter(allUnitsSingular, str)
                if(singularMatches[0]) {
                    unit = allUnits.find(u => u.singular == singularMatches[0])
                } else {
                    var abbrMatches = matchSorter(allUnitsAbbr, str)
                    if(abbrMatches[0]) {
                        unit = allUnits.find(u => u.abbr == abbrMatches[0])
                    }
                }
            }
            return unit;
        }

        if(args.length >= 3) {
            var convAmt = parseFloat(args[0])
            var convFrom = findUnit(args[1])
            var convTo = findUnit(args[2])
        } else {
            var failSafe = sepArg1[0] ? findUnit(sepArg1[0]) : null
            var convAmt = sepArg1[0] ? parseFloat(sepArg1[0]) : null
            var convTo = args[1] ? findUnit(args[1]) : null
            var convFrom = sepArg1[1] ? findUnit(sepArg1[1]) : null
        }

        if((!convFrom || !convTo) && !failSafe) return message.reply(`I don't recognise those units, sorry.`)

        if(convFrom) failSafe = {abbr: convFrom.abbr}
        if(convTo) failSafe = {abbr: convTo.abbr}

        if((!convTo || isNaN(convAmt) || (!sepArg1[1] && !convFrom)) && (failSafe || convFrom)) {
            conversion = convert().from(failSafe.abbr).possibilities();
            let units = conversion.map(function(e) {return `\`${e}\``});
            var clean = units.join(", ")
            return message.channel.send("You didn't provide any output units.\n" + `\`${failSafe.abbr.replace(/2/gi, "²").replace(/3/gi, "³")}\` can be converted to ${clean.replace(/2/gi, "²").replace(/3/gi, "³")}`)
        }
        if(convFrom.measure != convTo.measure) return message.reply(`You can't convert between \`${convFrom.measure}\` and \`${convTo.measure}\`!`)

        var conversion = convert(convAmt).from(convFrom.abbr).to(convTo.abbr)

        var convertedFromUnitClean = convAmt == 1 ? convFrom.singular : convFrom.plural
        var convertedToUnitClean = conversion == 1 ? convTo.singular : convTo.plural

        var reg = conversion.toString().match(new RegExp(/(?<=\b\.\b)0*/im));
        if(reg !== null) {var zeros = reg[0].toString().length}
        if(reg == null) {var zeros = 0}
        conversion = +conversion.toFixed(parseInt(zeros) + 2);
        
        
        var ConversionEmbed = client.scripts.getEmbed()
        .setAuthor("Unit Conversion", message.member.user.avatarURL, message.member.user.avatarURL)
        .setColor(message.member.displayHexColor)
        .addField("Input", `\`${sepArg1[0]}\` ${convertedFromUnitClean}`, true)
        .addField("Output", `\`${conversion}\` ${convertedToUnitClean}`, true)
        .setTimestamp()

        message.channel.send({embed: ConversionEmbed})
    }
}