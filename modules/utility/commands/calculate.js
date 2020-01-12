'use strict';

module.exports = {
    name: 'calculate',
    aliases: ['calc'],
    description: 'Calculates Formulas',
    args: true,
    usage: '<Formula>',
    rateLimit: {
        usages: 2,
        duration: 10,
        maxUsers: 5
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {

        var Formal = args.join(" ").replace(/pi/gi, "π").match(/([0-9^ +\-*/%()π.e]+)/gi)
        if (!Formal) return message.reply(`Invalid calculation`)
        var str = Formal[0]

        var Output = eval(str.replace(/\^/g, "**").replace(/π/g, `Math.PI`).replace(/e/gi, "Math.E"))

        var reg = Output.toString().match(new RegExp(/(?<=\b\.\b)0*/im));
        if (reg !== null) { var zeros = reg[0].toString().length }
        if (reg == null) { var zeros = 0 }
        Output = +Output.toFixed(parseInt(zeros) + 2);


        var CalcEmbed = client.scripts.getEmbed()
            .setAuthor("Calculation", message.member.user.avatarURL, message.member.user.avatarURL)
            .setColor(message.member.displayHexColor)
            .addField("Input", `\`${Formal[0]}\``, true)
            .addField("Output", `\`${Output}\``, true)
            .setTimestamp();

        message.channel.send({ embed: CalcEmbed });
    }
};