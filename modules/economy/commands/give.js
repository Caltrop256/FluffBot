'use strict';
const customGiveUnicode = new Map([
    [413, '<:howHigh:663360611782230016>'],
    [420, '<:ralGasp:654014647460036619>'],
    [69, '😏']
]);
module.exports = {
    name: 'give',
    aliases: ['lend', 'send', 'pay'],
    description: 'Give another user a specific amount of your money',
    args: true,
    usage: '<@user> <amount of coins>',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message)
    {
        let receivingUser = client.getMember(args[0], message.guild, null);
        if (!receivingUser) return message.reply("Couldn't find specified user");
        var giveNumber = parseInt(args[1])
        if (!giveNumber || isNaN(giveNumber)) return message.reply("please provide a valid amount of money to give.");
        if (Math.sign(parseInt(giveNumber)) < 0) return message.reply("nice try.");
        if (receivingUser === message.member) return message.reply("you can't give yourself " + client.cfg.curName);

        client.getMoney(message.author.id).then(money =>
        {
            let coins = money.coins
            if (coins - giveNumber < 0) return message.reply(`You don't have enough coins (${client.scripts.numComma(coins)}/${client.scripts.numComma(parseInt(giveNumber))})`);
            client.createConfirmation(message, {
                title: 'Are you sure?',
                description: `You are about to give ${client.scripts.numComma(parseInt(giveNumber))}${client.cfg.curName} to ${receivingUser.user.tag}!`,
                timeout: client.time(60000),
                color: '#00FF00',
                deleteMessage: false
            }).then((hasConfirmed) =>
            {
                if (!hasConfirmed)
                    return;

                client.updateMoney(message.author.id, -Math.abs(giveNumber));
                client.updateMoney(receivingUser.id, giveNumber);

                console.log(console.color.green(`[Economy]`), `${message.author.tag} gave ${giveNumber}${client.cfg.curName} to ${receivingUser.user.tag}`);

                var giveUnicode = customGiveUnicode.get(giveNumber) || '💸';
                var GiveEmbed = client.scripts.getEmbed()
                    .setAuthor(message.member.displayName, message.author.avatarURL, message.author.avatarURL)
                    .addField(giveUnicode, `Gave \`${client.scripts.numComma(parseInt(giveNumber))}${((giveNumber !== 69) || '') && client.cfg.curName}\` to **${receivingUser.displayName}**`)
                    .setColor("#00FF00")

                message.channel.send({ embed: GiveEmbed })

            }).catch((err) =>
            {
                if (!err)
                    return;
                message.channel.send("An Error Has Occured. Please DM a developer to look into this");
                client.lastErr.push(err);
                console.log(err);
            })
        });
    }
}