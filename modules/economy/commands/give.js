'use strict';

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

    execute(client, args, message) {


        let receivingUser = client.getMember(args[0], message.guild, null);
        if (!receivingUser) return message.reply("Couldn't find specified user");
        var giveNumber = parseInt(args[1])
        if (!giveNumber || isNaN(giveNumber)) return message.reply("please provide a valid amount of money to give.");
        if (Math.sign(parseInt(giveNumber)) < 0) return message.reply("nice try.");
        if (receivingUser === message.member) return message.reply("you can't give yourself " + client.cfg.curName);

        client.getMoney(message.author.id).then(money => {
            let coins = money.coins
            if (coins - giveNumber < 0) return message.reply(`You don't have enough coins (${client.scripts.numComma(coins)}/${client.scripts.numComma(parseInt(giveNumber))})`);

            message.channel.send(client.scripts.getEmbed().setAuthor('Are you sure?', message.author.displayAvatarURL).setDescription(`You are about to give ${client.scripts.numComma(parseInt(giveNumber))}${client.cfg.curName} to ${receivingUser.user.tag}!`).setColor("#00FF00").setTimestamp())
                .then(async msg => {
                    var emojis = ['✅', '❎']
                    await msg.react(emojis[0]);
                    await msg.react(emojis[1]);
                    const filter = (reaction, user) => {
                        return user.id != msg.author.id;
                    };
                    var collector = msg.createReactionCollector(filter, { time: 60000 });
                    collector.on('collect', reaction => {
                        if (!emojis.includes(reaction.emoji.name)) return msg.reactions.last().remove(reaction.users.first().id);
                        for (var u of reaction.users) {
                            if ((u[0] != message.author.id) && (u[0] != msg.author.id)) {
                                return reaction.remove(u[0]);
                            };
                        };
                        collector.stop();
                        if (reaction.emoji.name == emojis[0]) {

                            client.updateMoney(message.author.id, -Math.abs(giveNumber));
                            client.updateMoney(receivingUser.id, giveNumber);

                            console.log(console.color.green(`[Economy]`), `${message.author.tag} gave ${giveNumber}${client.cfg.curName} to ${receivingUser.user.tag}`);

                            var giveUnicode = '💸';
                            if (giveNumber === 413)
                                giveUnicode = '<:howHigh:663360611782230016>';
                            else if (giveNumber === 420)
                                giveUnicode = '<:ralGasp:654014647460036619>';
                            else if (giveNumber === 69)
                                giveUnicode = '😏';
                            var GiveEmbed = client.scripts.getEmbed()
                                .setAuthor(message.member.displayName, message.author.avatarURL, message.author.avatarURL)
                                .addField(giveUnicode, `Gave \`${client.scripts.numComma(parseInt(giveNumber))}${giveNumber !== 69 ? ' ' + client.cfg.curName : ''}\` to **${receivingUser.displayName}**`)
                                .setColor("#00FF00")

                            message.channel.send({ embed: GiveEmbed })
                        } else {
                            return
                        }
                    });
                    collector.on('end', () => {
                        msg.delete();
                    });
                });
        });
    }
}