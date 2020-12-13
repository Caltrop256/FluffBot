// message
/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
message        Message        The created message    */

module.exports = {
    execute(client, message)
    {
        if (!message.author.bot)
        {

            let mention = client.user.toString();
            let prefixLength = 0;
            let prefixArr = [mention, " " + mention, mention + " "];
            prefixArr.push(...client.cfg.prefix);
            for (var i = 0; i < prefixArr.length; i++)
            {
                if (message.content.startsWith(prefixArr[i].toString()))
                {
                    prefixLength = prefixArr[i].toString().length;
                } else if (message.content.startsWith("-" + prefixArr[i].toString()))
                {
                    prefixLength = prefixArr[i].toString().length + 1;
                };
            };
            if (prefixLength) return;

            let giveNumber = Math.floor(Math.random() * 15) + 15;
            let baseAMT = Math.floor(Math.random() * 15) + 15;

            if (giveNumber === baseAMT)
            {
                const embeds = message.embeds;
                const attachments = message.attachments;
                let eURL = ''
                if (embeds.length > 0)
                {
                    if (embeds[0].thumbnail && embeds[0].thumbnail.url)
                        eURL = embeds[0].thumbnail.url;
                    else if (embeds[0].image && embeds[0].image.url)
                        eURL = embeds[0].image.url;
                    else
                        eURL = embeds[0].url;
                } else if (attachments.array().length > 0)
                {
                    const attARR = attachments.array();
                    eURL = attARR[0].url;
                }

                var im = eURL ? 1 : 0

                var coinNum = Math.floor((giveNumber / 2) * (message.cleanContent.length * 0.1 + im)) < 1 ? 1 : Math.floor((giveNumber / 2) * (message.cleanContent.length * 0.1 + im))
                console.log(console.color.green(`[Economy]`), `Gave ${message.author.username} ${coinNum}${client.cfg.curName}`)

                client.updateMoney(message.author.id, coinNum);
            };
        };
    }
};