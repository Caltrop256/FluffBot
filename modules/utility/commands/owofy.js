'use strict';

module.exports = {
    name: 'owofy',
    aliases: ['uwufy'],
    description: 'OwOfies the input',
    args: false,
    usage: '<message>',
    rateLimit: {
        usages: 2,
        duration: 60,
        maxUsers: 7
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message)
    {
        const faces = ['(*^ω^)', '(◕‿◕✿)', '(◕ᴥ◕)', 'ʕ•ᴥ•ʔ', 'ʕ￫ᴥ￩ʔ', '(*^.^*)', 'owo', '(｡♥‿♥｡)', 'uwu', '(*￣з￣)', '>w<', '^w^', '(つ✧ω✧)つ', '(/ =ω=)/'];
        function owofy(string)
        {
            string = string.replace(/(?:l|r)/g, 'w');
            string = string.replace(/(?:L|R)/g, 'W');
            string = string.replace(/n([aeiou])/g, 'ny$1');
            string = string.replace(/N([aeiou])/g, 'Ny$1');
            string = string.replace(/N([AEIOU])/g, 'Ny$1');
            string = string.replace(/ove/g, 'uv');
            string = string.replace(/!+/g, ` ${faces[Math.floor(Math.random() * faces.length)]} `);

            return string;
        };
        if (args.length)
        {
            let uwu = owofy(args.join(" "));
            let uwuName = owofy(message.member.displayName)

            var UwUEmbed = client.scripts.getEmbed()
                .setColor(client.constants.neonPink.hex)
                .setAuthor(owofy(uwuName), message.member.user.avatarURL)
                .setDescription(uwu)
                .setFooter(owofy("!"))


            message.channel.send(UwUEmbed);
            message.delete(100)
        }
        if (!args.length)
        {
            message.channel.fetchMessages({ limit: 20 }).then(messages =>
            {

                let filteredMessage = messages.filter(msg => !msg.author.bot && !msg.content.toLowerCase().match(/(owo|uwu)fy/))
                var firstMessage = filteredMessage.first()

                if (!firstMessage) { return message.reply("I could not locate any human activity") }

                let uwu = owofy(firstMessage.content)
                let uwuName = owofy(firstMessage.member.displayName)

                var UwUEmbed = client.scripts.getEmbed()
                    .setColor(client.constants.neonPink.hex)
                    .setAuthor(owofy(uwuName), firstMessage.member.user.avatarURL)
                    .setDescription(uwu)
                    .setFooter(owofy("!" + ` - requested by ${message.member.displayName}`), message.member.user.avatarURL)


                message.channel.send(UwUEmbed);
                message.delete(100)

            })
        }

    }
}