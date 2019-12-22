'use strict';

module.exports = {
    name: 'wavefy',
    aliases: ['vaporize', 'vaporwave', 'vaporfy'],
    description: 'wavefies the input',
    args: false,
    usage: '<message>',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 120,
        maxUsers: 3
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, args, message) {
    const face = ['《', '「', '『', '【', '￥￥￥', '＄＄＄', '￡＄￥', '〔', '～～', '〈', '《'];
    const face2 = ['》', '」', '』', '】', '￥￥￥', '＄＄＄', '￥＄￡', '〕', '～～', '〉', '》'];
    const face3 = ['絶望', 'じゃがいも', 'てつびし', 'てんねんびし', 'くさぎ-る', 'ツ'];
    
    const waveString = (string) => {
        string = string.replace(/(?:a)/g, 'ａ');
        string = string.replace(/(?:A)/g, 'Ａ');
        string = string.replace(/(?:b)/g, 'ｂ');
        string = string.replace(/(?:B)/g, 'Ｂ');
        string = string.replace(/(?:c)/g, 'ｃ');
        string = string.replace(/(?:C)/g, 'Ｃ');
        string = string.replace(/(?:d)/g, 'ｄ');
        string = string.replace(/(?:D)/g, 'Ｄ');
        string = string.replace(/(?:e)/g, 'ｅ');
        string = string.replace(/(?:E)/g, 'Ｅ');
        string = string.replace(/(?:f)/g, 'ｆ');
        string = string.replace(/(?:F)/g, 'Ｆ');
        string = string.replace(/(?:g)/g, 'ｇ');
        string = string.replace(/(?:G)/g, 'Ｇ');
        string = string.replace(/(?:h)/g, 'ｈ');
        string = string.replace(/(?:H)/g, 'Ｈ');
        string = string.replace(/(?:i)/g, 'ｉ');
        string = string.replace(/(?:I)/g, 'Ｉ');
        string = string.replace(/(?:j)/g, 'ｊ');
        string = string.replace(/(?:J)/g, 'Ｊ');
        string = string.replace(/(?:k)/g, 'ｋ');
        string = string.replace(/(?:K)/g, 'Ｋ');
        string = string.replace(/(?:l)/g, 'ｌ');
        string = string.replace(/(?:L)/g, 'Ｌ');
        string = string.replace(/(?:m)/g, 'ｍ');
        string = string.replace(/(?:M)/g, 'Ｍ');
        string = string.replace(/(?:n)/g, 'ｎ');
        string = string.replace(/(?:N)/g, 'Ｎ');
        string = string.replace(/(?:o)/g, 'ｏ');
        string = string.replace(/(?:O)/g, 'Ｏ');
        string = string.replace(/(?:p)/g, 'ｐ');
        string = string.replace(/(?:P)/g, 'Ｐ');
        string = string.replace(/(?:q)/g, 'ｑ');
        string = string.replace(/(?:Q)/g, 'Ｑ');
        string = string.replace(/(?:r)/g, 'ｒ');
        string = string.replace(/(?:R)/g, 'Ｒ');
        string = string.replace(/(?:s)/g, 'ｓ');
        string = string.replace(/(?:S)/g, 'Ｓ');
        string = string.replace(/(?:t)/g, 'ｔ');
        string = string.replace(/(?:T)/g, 'Ｔ');
        string = string.replace(/(?:u)/g, 'ｕ');
        string = string.replace(/(?:U)/g, 'Ｕ');
        string = string.replace(/(?:v)/g, 'ｖ');
        string = string.replace(/(?:V)/g, 'Ｖ');
        string = string.replace(/(?:w)/g, 'ｗ');
        string = string.replace(/(?:W)/g, 'Ｗ');
        string = string.replace(/(?:x)/g, 'ｘ');
        string = string.replace(/(?:X)/g, 'Ｘ');
        string = string.replace(/(?:y)/g, 'ｙ');
        string = string.replace(/(?:Y)/g, 'Ｙ');
        string = string.replace(/(?:z)/g, 'ｚ');
        string = string.replace(/(?:Z)/g, 'Ｚ');
        
        string = string.replace(/(?:0)/g, '０');
        string = string.replace(/(?:1)/g, '１');
        string = string.replace(/(?:2)/g, '２');
        string = string.replace(/(?:3)/g, '３');
        string = string.replace(/(?:4)/g, '４');
        string = string.replace(/(?:5)/g, '５');
        string = string.replace(/(?:6)/g, '６');
        string = string.replace(/(?:7)/g, '７');
        string = string.replace(/(?:8)/g, '８');
        string = string.replace(/(?:9)/g, '９');
    
        string = string.replace(/(?:\*)/g, '＊');
        string = string.replace(/(?:\#)/g, '＃');
        string = string.replace(/(?:\&)/g, '＆');
        string = string.replace(/(?:\%)/g, '％');
        string = string.replace(/(?:~)/g, '～');
        string = string.replace(/(?:@)/g, '＠');
        string = string.replace(/(?:\$)/g, '＄');
        string = string.replace(/(?: )/g, ' 󠀡 ');
        string = string.replace(/\?+/g, `４２０`);   
    
        var number = Math.floor(Math.random() * face.length);
        string = string.replace(/<+/g, ` ${face[number]} `);
        string = string.replace(/>+/g, ` ${face2[number]} `);
        string = string.replace(/!+/g, ` ${face3[Math.floor(Math.random() * face3.length)]} `);
    
        return string;
    };

        if(args.length) {
            let uwu = waveString(args.join(" "));
            let uwuName = waveString(message.member.displayName)

            var UwUEmbed = client.scripts.getEmbed()
                    .setColor(client.constants.neonPink.hex)
                    .setAuthor(waveString(uwuName), message.member.user.avatarURL)
                    .setDescription(uwu)
                    
                    
            message.channel.send(UwUEmbed);
            message.delete(100)
        }
        if(!args.length) {
            message.channel.fetchMessages({ limit: 20 }).then(messages => {
                
                let filteredMessage = messages.filter(msg => !msg.content.toLowerCase().includes("wavefy")).filter(msg => !msg.author.bot).filter(msg => !msg.content.toLowerCase().includes("vapory"))
                var firstMessage = filteredMessage.first()

                if(!firstMessage) {return message.reply("I could not locate any human activity")}

                let uwu = waveString(firstMessage.content)
                let uwuName = waveString(firstMessage.member.displayName)

                var UwUEmbed = client.scripts.getEmbed()
                    .setColor(client.constants.neonPink.hex)
                    .setAuthor(waveString(uwuName), firstMessage.member.user.avatarURL)
                    .setDescription(uwu)
                    .setFooter(waveString(`requested by ${message.member.displayName}`), message.member.user.avatarURL)
                    
                    
                message.channel.send(UwUEmbed);
                message.delete(100)

            })
        }

   }
}