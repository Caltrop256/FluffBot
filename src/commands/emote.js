const Discord = require('discord.js');
const fs = require('fs');
var ordinal = require('ordinal-number-suffix')
var mergeImg = require('merge-img') 
const prettyMs = require('pretty-ms');
const average = require('image-average-color');
const rgbHex = require('rgb-hex');


module.exports = {
    name: 'emoteinfo',
    aliases: ['emote', 'aboutemote'],
    description: 'Shows information about an Emote',
    args: true,
    usage: '<:Emote:>',
    advUsage: 'The Bot must be in the same Guild as the emote.',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

async execute(client, arguments, receivedMessage) {

        var emoteEmbed = new Discord.RichEmbed()

        var EmoteArray = []
        
        var emoteMatcher = receivedMessage.content.match(/(?<=<:.*:)\d*/gim)
        if(emoteMatcher) {
            emoteMatcher.forEach((match, index) => {
                if(match !== "") {
                    var emoteObject = client.emojis.get(match)
                    if(emoteObject) {
                        EmoteArray.push(emoteObject.url)
                        var emoteAgeString = `${prettyMs(Date.now() - emoteObject.createdTimestamp, {verbose: true, compact: false})}`
                        emoteEmbed.addField(`:${emoteObject.name}:`, `Guild: \`${emoteObject.guild.name}\`\nCreated: \`${emoteAgeString.match(/.+?(?=(days \d))/gi)} days\` ago`)
                    } else {
                        return receivedMessage.reply(`Couldn't locate the ${ordinal(index)} emote.`)
                    }
                }
            })
        }
        var ID = Math.round(Math.random() * 10000)
        console.log(EmoteArray)
        if(EmoteArray.length < 1) return receivedMessage.reply(`Couldn't locate any Emotes.`)
        mergeImg(EmoteArray)
        .then((img) => {
            img.write(`./images/emoteMerge${ID}.png`, (err) => {
                if(err) throw err
                const attachment = new Discord.Attachment(`./images/emoteMerge${ID}.png`, `emoteMerge${ID}.png`);

                emoteEmbed.attachFile(attachment)
                emoteEmbed.setImage(`attachment://emoteMerge${ID}.png`);

                average(`./images/emoteMerge${ID}.png`, (err, color) => {
                    if (err) throw err;
                    var [red, green, blue, alpha] = color;
                    emoteEmbed.setColor(`#${rgbHex(red, green, blue)}`)

                    receivedMessage.channel.send({embed: emoteEmbed}).then(() => {
                        fs.unlink(`./images/emoteMerge${ID}.png`, (err) => {
                            if (err) throw err;
                            console.log(`emoteMerge${ID}.png was deleted`);
                          });
                  });
                })
            })
        });
    }
}


