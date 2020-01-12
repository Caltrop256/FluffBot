'use strict';

module.exports = {
    name: 'creaters',
    aliases: ['crs'],
    description: 'creates role-selection embed',
    args: false,
    usage: '',
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    perms: ['DEV'],


    execute(client, args, message) {
        const announcementEmoji = client.emojis.find(emoji => emoji.name === "Announcement_notif");
        const rsColorEmbed = client.scripts.getEmbed()
            .setAuthor("Role Selection", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
            .setColor(client.constants.neonGreen.hex)
            .setDescription("Click on the colored emoticons to get the corresponding color-role. Please avoid rapidly selecting  / unselecting roles. \nIn case you are having trouble getting your desired Role, try asking a Moderator instead.");
        message.channel.send({ embed: rsColorEmbed })
            .then(async function (message) {
                for (let i = 0; i < 18; i++) {
                    await message.react(client.constants.Colors[i].getEmoji(client));
                }
            })
        setTimeout(() => {
            message.channel.send("󠀡")
                .then(async function (message) {
                    for (let i = 18; i < client.constants.Colors.length; i++) {
                        await message.react(client.constants.Colors[i].getEmoji(client));
                    }
                })
        }, 22000);
        setTimeout(() => {

            const rsOtherEmbed = client.scripts.getEmbed()
                .setAuthor("Other Roles", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
                .setColor(client.constants.neonGreen.hex)
                .setDescription("Other Roles enable notifications or enable the viewing of other Channels. \nThey are explained in greater Detail below.")
                .addField("<:Announcement_notif:562914518808788992>", "Enables notification for new Announcements.")
                .addField("🗄", "Allows access to the Archives category.")
                .addField("🎮", "Allows access to the [#gaming](https://discordapp.com/channels/562324876330008576/562337407853264906) channel.")
                .addField("🎵", "Allows access to the [#music](https://discordapp.com/channels/562324876330008576/562337419299389455) channel.")
                .addField("🖊", "Allows access to the [#original-content](https://discordapp.com/channels/562324876330008576/607203663949070343) channel.")
                .addField("🌟", "Allows access to the [#starboard](https://discordapp.com/channels/562324876330008576/562337386701520897) channel.")
                .addField("🍔", "Allows access to the [#food](https://discordapp.com/channels/562324876330008576/579468655973105684) channel")


            message.channel.send({ embed: rsOtherEmbed })
                .then(async function (message) {
                    await message.react(announcementEmoji.id);
                    await message.react("🗄");
                    await message.react("🌟");
                    await message.react("🎮");
                    await message.react("🎵");
                    await message.react("🖊");
                    await message.react("🍔");

                })
        }, 35000)
    }
}