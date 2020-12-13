'use strict';

module.exports = {
    name: 'karma',
    aliases: ['upvotes', 'downvotes', 'score'],
    description: 'Displays the Karma and Awards of a user',
    args: false,
    usage: '<user>',
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],


    async execute(client, args, message)
    {

        var user = client.getMember(args.join(" "), message.guild, message.member);
        if (!user) return message.reply('Couldn\'t find that user.');

        var karmaInfo = await client.getUserKarma(user.id);
        if (!karmaInfo) karmaInfo = new client.Karma();
        var buffer = await client.getVoteBuffer(karmaInfo.upvotes, karmaInfo.downvotes);
        var files = [client.scripts.getAttachment(buffer, 'karma.png')];
        var Awards = ``;
        var upvoteEmoji = client.emojis.get("562330233315917843");
        var downvoteEmoji = client.emojis.get("562330227322388485");
        var platinum = client.emojis.get("586161821338042379");
        var gold = client.emojis.get("586161821551951882");
        var silver = client.emojis.get("586161821044441088");
        Awards += `${platinum}x${karmaInfo.platinum}\n`;
        Awards += `${gold}x${karmaInfo.gold}\n`;
        Awards += `${silver}x${karmaInfo.silver}\n`;

        var embed = client.scripts.getEmbed()
            .setAuthor(user.displayName + "'s Karma", user.user.displayAvatarURL)
            .setFooter(`Score: ${karmaInfo.karma}`, (karmaInfo.karma > 0) ? upvoteEmoji.url : (karmaInfo.karma < 0) ? downvoteEmoji.url : null)
            .setDescription(Awards)
            .setColor(user.displayColor ? user.displayColor : 0xFFD700)
            .setThumbnail('attachment://karma.png')
            .setTimestamp();

        message.channel.send({ embed, files });
    }
};