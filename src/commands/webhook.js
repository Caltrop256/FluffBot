const Discord = require('discord.js');
const config = require("./json/config.json");

const embedNeon_Pink = 0xFF0093


module.exports = {
    name: 'webhook',
    aliases: ['wh'],
    description: 'Creates a webhook of a User',
    args: true,
    usage: '<@user> <message>',
    guildOnly: true,
    rateLimit: {
        usages: Infinity,
        duration: 1,
        maxUsers: 1
    },
    permLevel: 5, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {

        var receivingUser = client.getMemberFromArg(receivedMessage, arguments)
        if(!receivingUser) {receivingUser = receivingUser}

        var content = arguments.join(" ").slice(client.cfg.prefix.length + arguments[0].length)

        if(receivingUser.displayName.toString().length < 3) {var name = receivedMessage.author.username}
        else {var name = receivingUser.displayName}

                const embeds = receivedMessage.embeds;
                const attachments = receivedMessage.attachments; 

                let eURL = ''

                if (embeds.length > 0) {

                if(embeds[0].thumbnail && embeds[0].thumbnail.url)
                    eURL = embeds[0].thumbnail.url;
                else if(embeds[0].image && embeds[0].image.url)
                    eURL = embeds[0].image.url;
                else
                    eURL = embeds[0].url;

                } else if (attachments.array().length > 0) {
                const attARR = attachments.array();
                eURL = attARR[0].url;
                }

        someoneWebhook(receivedMessage)

        async function someoneWebhook(receivedMessage) {

        await receivedMessage.channel.createWebhook(name, receivingUser.user.avatarURL)
        .then(webhook => webhook.edit(name, receivingUser.user.avatarURL))

            await receivedMessage.channel.fetchWebhooks().then((webhooks) => { 
                if (webhooks.filter(w => w.owner == client.user).array().length > 0){  

                    var someoneHook = webhooks.filter(w => w.owner == client.user).first();

                    webhookSend(someoneHook)

                    async function webhookSend(someoneHook) {
                    var someoneHook = webhooks.filter(w => w.owner == client.user).first();
                        await someoneHook.send(content, {file: eURL});
                        someoneHook.delete(100)
                }}
            })
            
        }
        receivedMessage.delete(100)

   }
}