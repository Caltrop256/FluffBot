'use strict';

const urban = require('relevant-urban');
const smartTruncate = require('smart-truncate');

module.exports = {
    name: 'define',
    aliases: ['urban'],
    description: 'defines a word',
    args: true,
    usage: 'word',
    rateLimit: {
        usages: 3,
        duration: 30,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {
        var user = message.member;
        if (args.join(" ").toLowerCase().match(/beautiful/gi)) {
            var temp = client.getMember(args[1], message.guild, message.member);
            if (temp)
                user = temp;
            if (args[1])
                message.delete();

            var avatarAttachment = client.scripts.getAttachment(user.user.displayAvatarURL, 'avatar.png')
            var DefinitionEmbed = client.scripts.getEmbed()
                .setAuthor(`Definition for "Beautiful"`, user.user.avatarURL)
                .setDescription(`**Definition**: ${user === message.member ? 'You!' : user}
            
**Example**:You're the definition of beautiful! <:neon_pink_heart:608779835090927661>`)
                .attachFile(avatarAttachment)
                .setImage('attachment://avatar.png')
                .setFooter(`${temp ? '120' : '110'}% of people agreed with this Definition.`)
                .setColor(0x007CFF);

            return message.channel.send({ embed: DefinitionEmbed });
        }
        return new Promise((resolve, reject) => {

            urban(encodeURI(args.join(" "))).then(definition => {
                if (!definition) return message.reply("couldn't find a definition for your word.")

                var LikeRatio = Math.round(definition.thumbsUp / (definition.thumbsUp + definition.thumbsDown) * 100)
                if (isNaN(LikeRatio)) LikeRatio = 0

                var DefinitionEmbed = client.scripts.getEmbed()
                    .setAuthor(`Definition for "${definition.word}"`, message.author.avatarURL, definition.urbanURL)
                    .setDescription(`**Definition**: ${smartTruncate(definition.definition.replace(/[\[\]]/gi, ""), 1000)}\n\n**Example**: ${smartTruncate(definition.example.replace(/[\[\]]/gi, ""), 1000)}`)
                    .setFooter(`${LikeRatio}% of people agreed with this Definition.`)
                    .setColor(0x007CFF)

                message.channel.send({ embed: DefinitionEmbed }).then(() => resolve(true)).catch((err) =>
                    reject(err));

            }).catch(error => {
                return message.channel.send("couldn't find a definition for your word.").then(() => resolve(true));
            })
        });
    }

}