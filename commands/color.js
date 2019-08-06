const Discord = require('discord.js');
const fs = require('fs');
var randomHexColor = require('random-hex-color')
const color = require('hex-to-color-name')
const replaceColor = require('replace-color')
const rgbHex = require('rgb-hex');
const rawcolorlist = require("./json/color.json");
const matchSorter = require('match-sorter')

module.exports = {
    name: 'color',
    aliases: ['hex', 'rgb', 'randomcolor', 'heart', '<3'],
    description: 'Displays a colored heart uwu',
    args: false,
    usage: '<hex | rgb>',
    advUsage: '**For String Input**: Wrap the Name of the color in quotes:\nFor example \`--prefcmd "green"\` will output the color green!\n\n**For Hex Input**: Just provide any hex code, including the hashtag at the beginning is optional. The bot will automatically trim uneeded Letters and add Fs in place of missing ones.\nExample: \`--prefcmd #FF7D00\`\n\n**For RGB Input**: Make sure to seperate RGB values with commas. Values can range from 0 to 255.\nExample: \`--prefcmd 255, 125, 0\`\n\nIf you don\'t provide any arguments the bot will chose a random one.',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 15,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

async execute(client, arguments, receivedMessage) {

        var colormap = {};
        var colorNames = []
        rawcolorlist.colors.forEach(color => {
            colormap[color.name] = `${color.hex}`
            colorNames.push(color.name)
        })
        colormap[`Perfect Orange`] = `FF7D00`
        colorNames.push(`Perfect Orange`)
        
        if(arguments.length > 0) {
            if(arguments.join(" ").match(/(?<=").*(?=")/ig)) {
                var StringInput = arguments.join(" ").match(/(?<=").*(?=")/ig)
                var Matches = matchSorter(colorNames, StringInput[0])
                if(Matches[0]) {
                    console.log(`Matched ${Matches[0]} (${Matches.length - 1} other matches)`)
                    var input = colormap[Matches[0]]
                } else {
                    return receivedMessage.reply(`Couldn't find \`${StringInput}\``)
                }
            }
            else if(arguments.join(" ").match(/(-?\d*( )?,( )?){2,}(\d*)/g)) {
                var rgbarray = arguments.join(" ").split(",")
                var r = Math.min(Math.max(parseInt(rgbarray[0]), 0), 255);
                var g = Math.min(Math.max(parseInt(rgbarray[1]), 0), 255);
                var b = Math.min(Math.max(parseInt(rgbarray[2]), 0), 255);
                var input = rgbHex(r, g, b)
            } else {
                var input = arguments[0]
            }
        } else input = randomHexColor()
        var preparedCode = input.replace(/^[^#]/gi, `#$&`).replace(/^[0-9]x/gi, `#`)
        while (preparedCode.length < 7) {
            preparedCode += `f`
        }
        preparedCode = preparedCode.substring(0,7).toUpperCase()
        if(!preparedCode.match(/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/gi)) return receivedMessage.reply(`please provide a valid Hex or RGB Code.`)
    

        replaceColor({
            image: './images/heart_template.png',
            colors: {
              type: 'hex',
              targetColor: '#BE1931',
              replaceColor: preparedCode
            }
          }, (err, jimpObject) => {
            if (err) return console.log(err)
            var ID = Math.round(Math.random() * 10000)
            jimpObject.write(`./images/heart${ID}.png`, (err) => {
                const attachment = new Discord.Attachment(`./images/heart${ID}.png`, `heart${ID}.png`);

                function hexToRgb(hex) {
                    var bigint = parseInt(hex, 16);
                    var r2 = (bigint >> 16) & 255;
                    var g2 = (bigint >> 8) & 255;
                    var b2 = bigint & 255;
                
                    return r2 + ", " + g2 + ", " + b2;
                }

                var colorEmbed = new Discord.RichEmbed()
                .setAuthor(color(preparedCode, colormap))
                .setDescription(`**Hex**: \`${preparedCode}\`  -  **RGB** \`${hexToRgb(preparedCode.replace("#", ""))}\``)
                .setColor(preparedCode)
                .attachFile(attachment)
                .setImage(`attachment://heart${ID}.png`);

                receivedMessage.channel.send({embed: colorEmbed}).then(() => {
                    fs.unlink(`./images/heart${ID}.png`, (err) => {
                        if (err) throw err;
                        console.log(`heart${ID}.png was deleted`);
                      });
                })
            })
          })
    }
}


