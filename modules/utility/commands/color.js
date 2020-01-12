'use strict';

const Discord = require('discord.js');
const fs = require('fs');
const replaceColor = require('replace-color');
const rawcolorlist = require(process.env.tropbot + "/library/color.json");
const matchSorter = require('match-sorter').default;

module.exports = {
    name: 'color',
    aliases: ['hex', 'rgb', 'randomcolor', 'heart', '<3'],
    description: 'Displays a colored heart uwu',
    args: false,
    usage: '<hex | rgb>',
    advUsage: '**For String Input**: Wrap the Name of the color in quotes:\nFor example \`--prefcmd "green"\` will output the color green!\n\n**For Hex Input**: Just provide any hex code, including the hashtag at the beginning is optional. The bot will automatically trim uneeded Letters and add Fs in place of missing ones.\nExample: \`--prefcmd #FF7D00\`\n\n**For RGB Input**: Make sure to seperate RGB values with commas. Values can range from 0 to 255.\nExample: \`--prefcmd 255, 125, 0\`\n\nIf you don\'t provide any args the bot will chose a random one.',
    rateLimit: {
        usages: 2,
        duration: 15,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    async execute(client, args, message) {

        var colormap = {};
        var colorNames = []
        rawcolorlist.colors.forEach(color => {
            colormap[color.name] = `${color.hex}`
            colorNames.push(color.name)
        })
        colormap[`Perfect Orange`] = `FF7D00`
        colorNames.push(`Perfect Orange`)

        function color(hex, color_map) {
            color_map = color_map;
            var rgb = h2r(hex);
            var min = Infinity;
            var closest = null;

            for (var color in color_map) {
                var rgb2 = h2r(color_map[color]);

                var dist = Math.pow((rgb.r - rgb2.r) * .299, 2) +
                    Math.pow((rgb.g - rgb2.g) * .587, 2) +
                    Math.pow((rgb.b - rgb2.b) * .114, 2);
                if (dist <= min) {
                    closest = color;
                    min = dist;
                };
            };
            return closest;
        };

        function h2r(hex) {
            var h2rs = {};
            hex = '#' == hex[0] ? hex.slice(1) : hex;
            if (h2rs[hex]) return h2rs[hex];
            var int = parseInt(hex, 16);
            var r = (int >> 16) & 255;
            var g = (int >> 8) & 255;
            var b = int & 255;
            return h2rs[hex] = { r: r, g: g, b: b };
        };

        if (args.length > 0) {
            if (!args.join(" ").match(/^#/i)) {
                var StringInput = args.join(" ")
                var Matches = matchSorter(colorNames, StringInput)
                if (Matches[0]) {
                    var input = colormap[Matches[0]]
                } else {
                    return message.reply(`Couldn't find \`${StringInput}\``)
                }
            } else {
                var input = args[0];
            }
        } else input = '#' + client.scripts.randomColor();
        var preparedCode = input;
        while (preparedCode.length < 7) {
            preparedCode += `f`
        }
        preparedCode = preparedCode.substring(0, 7).toUpperCase()
        if (!preparedCode.match(/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/gi)) return message.reply(`please provide a valid Hex or RGB Code.`)


        replaceColor({
            image: process.env.tropbot + '/assets/heart_template.png',
            colors: {
                type: 'hex',
                targetColor: '#BE1931',
                replaceColor: preparedCode
            }
        }, (err, jimpObject) => {
            if (err) return console.error(err)
            var ID = Math.round(Math.random() * 10000)
            jimpObject.write(process.env.tropbot + `/assets/heart${ID}.png`, (err) => {
                if (err) return console.error(err);
                const attachment = new Discord.Attachment(process.env.tropbot + `/assets/heart${ID}.png`, `heart${ID}.png`);

                var colorEmbed = new Discord.RichEmbed()
                    .setAuthor(color(preparedCode, colormap))
                    .setDescription(`**Hex**: \`${preparedCode}\`  -  **RGB** \`${client.scripts.endListWithAnd(client.scripts.hexToRGB(preparedCode.replace("#", "")))}\``)
                    .setColor(preparedCode)
                    .attachFile(attachment)
                    .setImage(`attachment://heart${ID}.png`);

                message.channel.send({ embed: colorEmbed }).then(() => {
                    fs.unlink(process.env.tropbot + `/assets/heart${ID}.png`, (err) => {
                        if (err) return console.error(err);
                        console.log(`heart${ID}.png was deleted`);
                    });
                })
            })
        })
    }
}