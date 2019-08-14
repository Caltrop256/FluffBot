const Discord = require('discord.js');
const config = require("./json/config.json");
const fs = require('fs');
const ms = require('ms');
const translate = require('google-translate-api');
const prettyMs = require('pretty-ms');

const embedPerfect_Orange = 0xFF7D00 
const embedGreen = 0x74B979


module.exports = {
    name: 'translate',
    aliases: ['trans'],
    description: 'Translates Text',
    args: false,
    usage: '<text to translate>',
    guildOnly: false,
    rateLimit: {
        usages: 0,
        duration: 0,
        maxUsers: 0
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: false,

    execute(client, arguments, receivedMessage, primaryCommand) {
        var hrstart = process.hrtime()

        if(arguments) {var input = receivedMessage.content.slice(client.cfg.prefix.length + primaryCommand.length, receivedMessage.content.length)}
        if(!arguments) {
            receivedMessage.channel.fetchMessages({ limit: 20 }).then(messages => {
                
                let filteredMessage = messages.filter(msg => !msg.content.toLowerCase().includes(client.cfg.prefix + "trans")).filter(msg => !msg.author.bot).filter(msg => !msg.content.toLowerCase().includes(prefix + "translate"))
                var firstMessage = filteredMessage.first()

                if(!firstMessage) {return receivedMessage.reply("I could not locate any human activity")}

                var input = firstMessage.content
            })
        }

        translate(input, {to: 'en'}).then(res => {
            var translation = res.text;
            var fromLanguage = res.from.language.iso;
            if(res.from.text.autoCorrected === true) {var improvementType = "Auto Corrected:"; var typo = res.from.text.value}
            if(res.from.text.didYouMean === true) {var improvementType = "Did you mean..."; var typo = res.from.text.value}

            if(res.from.text.autoCorrected === true || res.from.text.didYouMean === true) {
                hrend = process.hrtime(hrstart)
                var TranslationEmbed = new Discord.RichEmbed()
                .setAuthor("Translation", receivedMessage.member.user.avatarURL, receivedMessage.member.user.avatarURL)
                .setDescription("Translated from " + fromLanguage + ".")
                .setColor(embedPerfect_Orange)
                .addField("Input", Input, true)
                .addField("Output", translation, true)
                .addField(improvementType, typo)
                .setFooter(`Translated in: ${hrend[0]} seconds, ${prettyMs(hrend[1] / 1000000, {formatSubMilliseconds: true, verbose: true})}`)

                receivedMessage.channel.send({embed: TranslationEmbed})
            }
            if(res.from.text.autoCorrected === false && res.from.text.didYouMean === false) {
                hrend = process.hrtime(hrstart)
                var TranslationEmbed = new Discord.RichEmbed()
                .setAuthor("Translation", receivedMessage.member.user.avatarURL, receivedMessage.member.user.avatarURL)
                .setDescription("Translated from " + fromLanguage + ".")
                .setColor(embedGreen)
                .addField("Input", Input, true)
                .addField("Output", translation, true)
                .setFooter(`Translated in: ${hrend[0]} seconds, ${prettyMs(hrend[1] / 1000000, {formatSubMilliseconds: true, verbose: true})}`)

                receivedMessage.channel.send({embed: TranslationEmbed})
            }
        }).catch(err => {
            console.error(err);
        });
    }
}