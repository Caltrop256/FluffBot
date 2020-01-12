'use strict';

const Discord = require('discord.js')
const config = require(process.env.tropbot + "/config.json");
const plotly = require('plotly')(config.pName, config.pToken);

module.exports = {
    name: 'compare',
    aliases: ['moneycompare'],
    description: `Compares the amount of money between 2 users.`,
    args: true,
    usage: '<users>',
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    async execute(client, args, message) {
        var connection = client.scripts.getSQL(true);
        var ids = new Array();
        var names = new Array();
        var colors = new Array();

        var mentions = new Array();

        if (args.length < 2) args[1] = `${message.author.id}`
        for (var i = 0; i < args.length; i++) {
            var member = client.getMember(args[i], message.guild, null);
            if (member && !ids.includes(member.id)) {
                let user = member.user;
                ids.push(member.id);
                names.push(user.tag.replace(/[^\x00-\x7F]/gi, ""));
                colors.push(member.displayHexColor);
                mentions.push(member.toString())
            };
        };
        if (ids.length < 2) return message.reply(`Please provide at least 1 user to compare yourself with!`)



        function mentionsLimit(mentionsArr) {
            if (mentionsArr.length > 5) {
                mentionsArr[4] = `${mentionsArr.length - 5} others`
                mentionsArr.length = 5;
            }
            return mentionsArr;
        }
        let coinEmbed = new Discord.RichEmbed()
            .setAuthor(`Wealth Comparison`)
            .setColor("#00FF00");
        /*
               reject codes:
               1 : no coins
               2 : no entries
               3 : not enough entries
               4 : sql error
               5 : plot.ly error
               6 : successfully got trace (getTraces only)
               [Object object] : unhandled exception
       */
        function errDesc(errCodes) {
            if (errCodes.every(code => code == 6)) return;
            var descInfo = ''
            for (i = 0; i < errCodes.length; i++) {
                if (errCodes[i] == 6) continue;
                descInfo += '\n';

                switch (errCodes[i]) {
                    case 1: descInfo += `${mentions[i]} has never received or spent any money, what a Lurker`; break;
                    case 2: descInfo += `No entries found for ${mentions[i]}.`; break;
                    case 3: descInfo += `${mentions[i]} doesn't have enough entries to draw a complete Graph!`; break;
                    case 4: descInfo += `An SQL error occured while trying to get ${mentions[i]}'s coins/entries`; break;
                    default: descInfo += 'This should not appear.If it does, please contact one of the developers  (Type:errArr)';
                }
            }
            return descInfo.substring(1, descInfo.length);
        }
        var notGraphedCount = 0
        client.getGraphs(ids, names, colors, 'Wealth Comparison', 7, 7).then(graphInfo => {
            var graph = graphInfo.graph;
            var codes = graphInfo.codes;
            var mentionGraphed = new Array()
            for (i = 0; i < mentions.length; i++) {
                if (codes[i] == 6) mentionGraphed.push(mentions[i]);
            }
            var attachment = new Discord.Attachment(graph, "graph.png");
            coinEmbed
                .setTimestamp()
                .attachFile(attachment)
                .setImage('attachment://graph.png')
                .setDescription(`Below you will see the wealth of ${client.scripts.endListWithAnd(mentionsLimit(mentionGraphed))}.`);
            if (codes.every(code => code == 6)) return;
            notGraphedCount = codes.length - mentionGraphed.length;
            coinEmbed.addField(`\nFailed to graph ${notGraphedCount} user${notGraphedCount != 1 ? 's' : ''}`, errDesc(codes))

        }).catch(errCodes => {
            var descInfo = '';
            if (errCodes.length) {
                descInfo = 'Failed to get graphs for any of the mentioned users for the following reasons:\n';
                descInfo += errDesc(errCodes);
            }
            else if (typeof (errorCodes) == 'number')
                if (errorCodes == 5)
                    descInfo = 'A plot.ly error has occurred. This is most likely due to the service being down. Please try running the command later';
                else
                    descInfo = 'This should not appear.If it does, please contact one of the developers (Type:errNum)';
            else {
                if (errCodes.message.includes('RichEmbed field'))
                    coinEmbed.addField('Error', `Unable to display all ${notGraphedCount} user${notGraphedCount != 1 ? 's' : ''} who werens't able to be traced`);
                else if (errCodes.message == 'Too many connections')
                    descInfo = 'An SQL error occurred while getting user info. Please wait at least 20 seconds and try again';
                else
                    descInfo = 'An unhandled exception has occurred while getting the graphs. Please contact one of the developers about this'
            }
            if (descInfo.length) coinEmbed.setDescription(descInfo)
        }).finally(() => {
            message.channel.send({ embed: coinEmbed })
        });
    }
}