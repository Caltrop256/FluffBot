const Discord = require('discord.js');
const embedGreen = 0x74B979
const embedNeon_Green = 0x1DFF2D

module.exports = {
    name: 'rssetup',
    aliases: ['roleselectionembed'],
    description: 'Sets up the Role Selection Embed',
    args: false,
    usage: '',
    guildOnly: false,
    rateLimit: {
        usages: 2,
        duration: 120,
        maxUsers: 1
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {
    const blackEmoji = client.emojis.find(emoji => emoji.name === "color_black");
    const greyEmoji = client.emojis.find(emoji => emoji.name === "color_grey");
    const mossEmoji = client.emojis.find(emoji => emoji.name === "color_moss");
    const bright_greenEmoji = client.emojis.find(emoji => emoji.name === "color_bright_green");
    const greenEmoji = client.emojis.find(emoji => emoji.name === "color_green");
    const neon_greenEmoji = client.emojis.find(emoji => emoji.name === "color_neon_green");
    const turqoiseEmoji = client.emojis.find(emoji => emoji.name === "color_turquoise");
    const aquaEmoji = client.emojis.find(emoji => emoji.name === "color_aqua");
    const cyanEmoji = client.emojis.find(emoji => emoji.name === "color_cyan");
    const tealEmoji = client.emojis.find(emoji => emoji.name === "color_teal");
    const sky_blueEmoji = client.emojis.find(emoji => emoji.name === "color_sky_blue");
    const blueEmoji = client.emojis.find(emoji => emoji.name === "color_blue");
    const ocean_blueEmoji = client.emojis.find(emoji => emoji.name === "color_ocean_blue");
    const ultramarineEmoji = client.emojis.find(emoji => emoji.name === "color_ultramarine");
    const dark_purpleEmoji = client.emojis.find(emoji => emoji.name === "color_dark_purple");
    const periwinkleEmoji = client.emojis.find(emoji => emoji.name === "color_periwinkle");
    const magentaEmoji = client.emojis.find(emoji => emoji.name === "color_magenta");
    const light_magentaEmoji = client.emojis.find(emoji => emoji.name === "color_light_magenta");
    const violetEmoji = client.emojis.find(emoji => emoji.name === "color_violet");
    const beigeEmoji = client.emojis.find(emoji => emoji.name === "color_beige");
    const peachEmoji = client.emojis.find(emoji => emoji.name === "color_peach");
    const pinkEmoji = client.emojis.find(emoji => emoji.name === "color_pink");
    const hot_pinkEmoji = client.emojis.find(emoji => emoji.name === "color_hot_pink");
    const neon_pinkEmoji = client.emojis.find(emoji => emoji.name === "color_neon_pink");
    const redEmoji = client.emojis.find(emoji => emoji.name === "color_red");
    const redderEmoji = client.emojis.find(emoji => emoji.name === "color_reder");
    const dark_orangeEmoji = client.emojis.find(emoji => emoji.name === "color_dark_orange");
    const perfect_orangeEmoji = client.emojis.find(emoji => emoji.name === "color_perfect_orange");
    const bright_orangeEmoji = client.emojis.find(emoji => emoji.name === "color_bright_orange");
    const orangeEmoji = client.emojis.find(emoji => emoji.name === "color_orange");
    const yellowEmoji = client.emojis.find(emoji => emoji.name === "color_yellow");
    const bright_yellowEmoji = client.emojis.find(emoji => emoji.name === "color_bright_yellow");
    const announcementEmoji = client.emojis.find(emoji => emoji.name === "Announcement_notif");

    receivedMessage.channel.send({embed: rsColorEmbed})
    .then(async function (message){
        await message.react(blackEmoji.id);
        await message.react(greyEmoji.id);
        await message.react(mossEmoji.id);
        await message.react(bright_greenEmoji.id);
        await message.react(greenEmoji.id);
        await message.react(neon_greenEmoji.id)
        await message.react(turqoiseEmoji.id);
        await message.react(aquaEmoji.id);
        await message.react(cyanEmoji.id);
        await message.react(tealEmoji.id);
        await message.react(sky_blueEmoji.id);
        await message.react(blueEmoji.id);
        await message.react(ocean_blueEmoji.id);
        await message.react(ultramarineEmoji.id);
        await message.react(dark_purpleEmoji.id);
        await message.react(periwinkleEmoji.id);
        await message.react(magentaEmoji.id);
        await message.react(light_magentaEmoji.id);
        await message.react(violetEmoji.id);
        await message.react(beigeEmoji.id);

        
    })
    setTimeout(() => {
        receivedMessage.channel.send("󠀡")
        .then(async function (message) {
            await message.react(peachEmoji.id);
            await message.react(pinkEmoji.id);
            await message.react(hot_pinkEmoji.id);
            await message.react(neon_pinkEmoji.id);
            await message.react(redEmoji.id);
            await message.react(redderEmoji.id);
            await message.react(dark_orangeEmoji.id);
            await message.react(perfect_orangeEmoji.id);
            await message.react(bright_orangeEmoji.id);
            await message.react(orangeEmoji.id);
            await message.react(yellowEmoji.id);
            await message.react(bright_yellowEmoji.id);
        })
      }, 22000);

      setTimeout(() => {

        const rsOtherEmbed = new Discord.RichEmbed()
        .setAuthor("Other Roles", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
        .setColor(embedNeon_Green)
        .setDescription("Other Roles enable notifications or enable the viewing of other Channels. \nThey are explained in greater Detail below.")
        .addField("<:Announcement_notif:562914518808788992>", "Enables notification for new Announcements.")
        .addField("🗄", "Allows access to the Archives category.")
        .addField("🎮", "Allows access to the [#gaming](https://discordapp.com/channels/562324876330008576/562337407853264906) channel.")
        .addField("🎵", "Allows access to the [#music](https://discordapp.com/channels/562324876330008576/562337419299389455) channel.")
        .addField("🖊", "Allows access to the [#original-content](https://discordapp.com/channels/562324876330008576/607203663949070343) channel.")
        .addField("🌟", "Allows access to the [#starboard](https://discordapp.com/channels/562324876330008576/562337386701520897) channel.")
        .addField("🍔", "Allows access to the [#food](https://discordapp.com/channels/562324876330008576/579468655973105684) channel")


        receivedMessage.channel.send({embed: rsOtherEmbed})
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
};

const rsColorEmbed = new Discord.RichEmbed()
    .setAuthor("Role Selection", "https://b.thumbs.redditmedia.com/gdnYkuWjcBr4BkYk89BrtLCpbjGcawg71ZgebIQ4VfQ.png")
    .setColor(embedNeon_Green)
    .setDescription("Click on the colored emoticons to get the corresponding color-role. Please avoid rapidly selecting  / unselecting roles. \nIn case you are having trouble getting your desired Role, try unreacting and reacting again or ask a Moderator instead.")