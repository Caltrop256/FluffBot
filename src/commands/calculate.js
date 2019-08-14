const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const prettyMs = require('pretty-ms');

const embedGreen = 0x74B979


module.exports = {
    name: 'calculate',
    aliases: ['calc'],
    description: 'Calculates Formulas',
    args: true,
    usage: '<Formula>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 5
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        var hrstart = process.hrtime()

        var Formal = arguments.join(" ").replace(/pi/gi, "π").match(/([0-9^ +\-*/%()π.e]+)/gi)
        if(!Formal) return receivedMessage.reply(`Invalid calculation`)
        var str = Formal[0]

        var Output = eval(str.replace(/\^/g, "**").replace(/π/g, `Math.PI`).replace(/e/gi, "Math.E"))

        var reg = Output.toString().match(new RegExp(/(?<=\b\.\b)0*/im));
            if(reg !== null) {var zeros = reg[0].toString().length}
            if(reg == null) {var zeros = 0}
            Output = +Output.toFixed(parseInt(zeros) + 2);



        hrend = process.hrtime(hrstart)
        var CalcEmbed = new Discord.RichEmbed()
        .setAuthor("Calculation", receivedMessage.member.user.avatarURL, receivedMessage.member.user.avatarURL)
        .setColor(embedGreen)
        .addField("Input", Formal[0], true)
        .addField("Output", `\`${Output}\``, true)
        .setFooter(`Calculated in: ${hrend[0]} seconds, ${prettyMs(hrend[1] / 1000000, {formatSubMilliseconds: true, verbose: true})}`)

        receivedMessage.channel.send({embed: CalcEmbed})
    }
}