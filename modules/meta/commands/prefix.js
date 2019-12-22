'use strict';
module.exports = {
    name: 'prefix',
    aliases: ['pref', 'changeprefix'],
    description: 'Add or remove prefixes',
    args: false,
    usage: '<add|remove> <prefixname>',
    rateLimit: {
        usages: 3,
        duration: 0,
        maxUsers: 5
    },
    perms: ['DEV'],

    async execute(client, args, message) {
        if (!args.length) return message.channel.send(`My prefixes are: ${client.scripts.endListWithAnd(client.cfg.prefix)}`)
        var embedError = client.scripts.getEmbed()
            .setColor(client.constants.red.hex)
            .setAuthor('Invalid Request')
            .setTimestamp();

        if (args.length < 2) {
            return message.channel.send({ embed: embedError.setDescription(`Invalid arguments, try doing \`${client.cfg.prefix[0]}help ${this.name}\``) });
        }
        var pref = args[1].replace(/["'`]/g, '');
        if (!pref.length) return message.channel.send({
            embed: embedError.setDescription(`Invalid prefix!\nYour prefix must be at least 1 character long and may not include any of the following Characters: ` + "`\"'``")
        });

        switch (args[0].toLowerCase()) {
            case 'add':
            case 'a':
            case '+':
                var connection = client.scripts.getSQL();
                connection.query(`INSERT INTO prefixes (prefix) VALUES ('${pref}')`, (err) => {
                    if (err) return console.error(err);
                    client.cfg.prefix.push(pref);
                    message.channel.send(client.scripts.getEmbed().setAuthor('Successfully added prefix').setDescription(`**${pref}** is now a valid prefix!`).setTimestamp().setColor(client.constants.green.hex));
                })
                break;
            case 'remove':
            case 'delete':
            case 'r':
            case 'd':
            case '-':
                var connection = client.scripts.getSQL();
                connection.query(`SELECT * FROM prefixes WHERE prefix = '${pref}'`, (err, rows) => {
                    if (err) return console.error(err);
                    if (!rows.length) {
                        return message.channel.send({ embed: embedError.setDescription(`I couldn't find the **${pref}** prefix, make sure your capitalisation is correct.`) });
                    } else {
                        connection.query(`DELETE FROM prefixes WHERE prefix = '${pref}'`, (err) => {
                            if (err) return console.error(err);
                            client.cfg.prefix.splice(client.cfg.prefix.indexOf(pref), 1);
                            message.channel.send(client.scripts.getEmbed().setAuthor('Successfully removed prefix').setDescription(`**${pref}** is no longer a valid prefix!`).setTimestamp().setColor(client.constants.green.hex));
                        })
                    }
                })
                break;

            default:
                message.channel.send({ embed: embedError.setDescription(`Unknown Operation, try doing **add** or **remove** instead`) });
                break;
        }
    }
}