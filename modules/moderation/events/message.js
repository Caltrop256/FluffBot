// message
/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
message        Message        The created message    */

module.exports = {
    execute(client, message) {
        if (!message.guild) {
            if (/https?:\/\/(canary\.)?discordapp\.com\/channels\/([0-9]+)\/([0-9]+)\/([0-9]+)/.test(message.content))
                return client.scripts.getMessageFromLink(client, message.content).then(msg => client.reportFunc(msg, message.author));
            else
                return;
        };
        if ((['k', '🇰', '𝓚', 'ᴋ'].includes(message.content.replace(/[^a-zA-Z🇰𝓚ᴋ]/g, '').toLowerCase())) || (/^([. ]+)$/.test(message.content))) return message.delete(1);
        var editedString = client.swearDetect(message.content)
        if (editedString.replaced) {
            console.log(console.color.yellow(`[Swear Filter] [Textmessage]`), ` "${message.cleanContent}" => "${editedString.string}"`)

            if (message.member.displayName.toString().length < 3) { var name = message.author.username }
            else { var name = message.member.displayName }

            const embeds = message.embeds;
            const attachments = message.attachments;

            let eURL = ''

            if (embeds.length > 0) {

                if (embeds[0].thumbnail && embeds[0].thumbnail.url)
                    eURL = embeds[0].thumbnail.url;
                else if (embeds[0].image && embeds[0].image.url)
                    eURL = embeds[0].image.url;
                else
                    eURL = embeds[0].url;

            } else if (attachments.array().length > 0) {
                const attARR = attachments.array();
                eURL = attARR[0].url;
            }

            userImitate(message)

            async function userImitate(message) {
                var avatarURL = message.author.avatarURL.replace('.gif', '.png')
                await message.channel.createWebhook(name, avatarURL)
                    .then(webhook => webhook.edit(name, avatarURL))

                await message.channel.fetchWebhooks().then((webhooks) => {
                    if (webhooks.filter(w => w.owner == client.user).array().length > 0) {

                        var someoneHook = webhooks.filter(w => w.owner == client.user).first();

                        webhookSend(someoneHook)

                        async function webhookSend(someoneHook) {
                            var someoneHook = webhooks.filter(w => w.owner == client.user).first();
                            await someoneHook.send(editedString.string, { file: eURL, split: true });
                            someoneHook.delete(100)
                        }
                    }
                })

            }
            message.delete(100);
        }
        var introductionChannel = client.channels.get("566352036069900306")
        var introducedRole = message.guild.roles.get("566595092102643712");
        if (message.channel == introductionChannel) {
            console.log(`Gave ${message.author.tag} role ${introducedRole.name}`);
            message.member.addRole(introducedRole)
        }

    }
}