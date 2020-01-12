// messageUpdate
/* Emitted whenever a message is updated - e.g. embed or content change.
PARAMETER     TYPE           DESCRIPTION
oldMessage    Message        The Message before the update
newMessage    Message        The Message after the update    */

module.exports = {
    execute(client, oldMessage, newMessage) {
        if ((['k', '🇰', '𝓚', 'ᴋ'].includes(newMessage.content.replace(/[^a-zA-Z🇰𝓚ᴋ]/g, '').toLowerCase())) || (/^([. ]+)$/.test(newMessage.content))) return newMessage.delete(1);
        var editedString = client.swearDetect(newMessage.content)
        if (editedString.replaced) {
            console.log(console.color.yellow(`[Swear Filter] [Text Message (edited)]`), ` "${newMessage.cleanContent}" => "${editedString.string}"`)

            if (newMessage.member.displayName.toString().length < 3) { var name = newMessage.author.username }
            else { var name = newMessage.member.displayName }

            const embeds = newMessage.embeds;
            const attachments = newMessage.attachments;

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

            userImitate(newMessage)

            async function userImitate(newMessage) {

                await newMessage.channel.createWebhook(name, newMessage.member.user.avatarURL)
                    .then(webhook => webhook.edit(name, newMessage.member.user.avatarURL))

                await newMessage.channel.fetchWebhooks().then((webhooks) => {
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
            newMessage.delete(100);
        }
    }
};