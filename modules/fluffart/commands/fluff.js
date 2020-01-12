const https = require('https');
const config = require(process.env.tropbot + '/config.json');

module.exports = {
    name: 'fluff',
    aliases: ['ralsei', 'fetchmearalsei', 'floof'],
    description: 'Fetches a random image of Ralsei',
    args: false,
    usage: '',
    rateLimit: {
        usages: 3,
        duration: 30,
        maxUsers: 5
    },
    perms: [],

    async execute(client, args, message) {
        function Get(URL) {
            return new Promise((resolve, reject) => {
                var Done = false;
                https.get(URL, (resp) => {
                    data = '';
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    resp.on('end', () => {
                        resolve(JSON.parse(data))
                    });
                }).on("error", (err) => {
                    reject(err);
                });
            })
        }

        while (true) {
            var ResultObj = await Get("https://fluffyart.cheeseboye.com/randimage.php?bot")

            if (ResultObj.file.Extension == "png" || ResultObj.file.Extension == "gif" || ResultObj.file.Extension == "jpg") {
                break;
            }
        }

        var fluffyArtEmbed = client.scripts.getEmbed()
            .setAuthor("Random Fluffyboi", "https://i.imgur.com/T9ACLM2.png", `https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)
            .setColor(message.member.displayHexColor)
            .setThumbnail(`https://fluffyart.cheeseboye.com/Thumbnails/${ResultObj.file.Filename}.png`)
            .setImage(`https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)
            .setFooter("Powered by fluffyart.cheeseboye.com")
            .addField("Likes", ResultObj.file.Likes, true)
            .addField("Reports", ResultObj.file.Reports, true)
            .setFooter(`${ResultObj.file.ID} | Powered by fluffyart.cheeseboye.com`)
            .setTimestamp()

        message.channel.send({ embed: fluffyArtEmbed }).then(async msg => {
            const VotingTime = 60000

            await msg.react("👍")
            await msg.react("❌")
            var reacted = ''

            const Likefilter = (reaction, user) => {
                return reaction.emoji.name === '👍' && user.id === message.author.id;
            };
            msg.awaitReactions(Likefilter, { max: 1, time: VotingTime, errors: ['time'] })
                .then(collected => likeFunc(collected)).catch((error) => console.log(error))


            async function likeFunc(collected) {
                if (reacted.includes("disabled")) { return }

                var collection = collected.first()



                await msg.clearReactions()
                reacted += "disabled"

                var LikePlusEmbed = client.scripts.getEmbed()
                    .setAuthor("Random Fluffyboi", "https://i.imgur.com/T9ACLM2.png", `https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)
                    .setColor(message.member.displayHexColor)
                    .setThumbnail(`https://fluffyart.cheeseboye.com/Thumbnails/${ResultObj.file.Filename}.png`)
                    .setImage(`https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)
                    .setFooter("Powered by fluffyart.cheeseboye.com")
                    .addField("Likes", ResultObj.file.Likes + collection.count - 1, true)
                    .addField("Reports", ResultObj.file.Reports, true)
                    .setFooter(`${ResultObj.file.ID} | Powered by fluffyart.cheeseboye.com`)
                    .setTimestamp()
                msg.edit("", LikePlusEmbed)

                var SuccessObj = await Get(`https://fluffyart.cheeseboye.com/like.php?password=${config.fluffToken}&filename=${ResultObj.file.Filename}&count=${collection.count - 1}`)



                var otherCount = collection.count - 2

                var reactionUsers = [];

                await collection.users.forEach(u => {

                    if (!u.bot) {
                        reactionUsers.push(u.username)
                    }
                });

                let reactionUsersClean = reactionUsers.map(function (e) { return "\`" + e + "\`" });

                if (SuccessObj.success == true) {
                    message.channel.send(`🎉 ${reactionUsersClean.join(", ").replace(/, ([^,]*)$/, ' and $1')} liked the Image!`)
                } else { message.reply("Encountered an Error while trying to like the image, please message **Caltrop#0001** if this Error persists.") }
            }


            const ReportFilter = (reaction, user) => {
                return reaction.emoji.name === '❌' && user.id === message.author.id;
            };
            msg.awaitReactions(ReportFilter, { max: 1, time: VotingTime, errors: ['time'] })
                .then(collected => reportFunc(collected)).catch((error) => console.log(error))

            async function reportFunc(collected) {
                if (reacted.includes("disabled")) { return }

                var collection = collected.first()

                await msg.clearReactions()
                reacted += "disabled"

                var ReportPlusEmbed = client.scripts.getEmbed()
                    .setAuthor("Random Fluffyboi", "https://i.imgur.com/T9ACLM2.png", `https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)
                    .setColor(message.member.displayHexColor)
                    .setThumbnail(`https://fluffyart.cheeseboye.com/Thumbnails/${ResultObj.file.Filename}.png`)
                    .setImage(`https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)
                    .setFooter("Powered by fluffyart.cheeseboye.com")
                    .addField("Likes", ResultObj.file.Likes, true)
                    .addField("Reports", ResultObj.file.Reports + collection.count - 1, true)
                    .setFooter(`${ResultObj.file.ID} | Powered by fluffyart.cheeseboye.com`)
                    .setTimestamp()
                msg.edit("", ReportPlusEmbed)

                var SuccessObj = await Get(`https://fluffyart.cheeseboye.com/report.php?password=${config.fluffToken}&filename=${ResultObj.file.Filename}&count=${collection.count - 1}`)

                var otherCount = collection.count - 2

                var reactionUsers = [];

                await collection.users.forEach(u => {
                    if (!u.bot) {
                        reactionUsers.push(u.username)
                    }
                });

                let reactionUsersClean = reactionUsers.map(function (e) { return "\`" + e + "\`" });



                if (SuccessObj.success == true) {
                    message.channel.send(`${reactionUsersClean.join(", ").replace(/, ([^,]*)$/, ' and $1')} reported the Image!`)
                } else { message.reply("Encountered an Error while trying to report the image, please message **Caltrop#0001** if this Error persists.") }
            }

            setTimeout(() => {
                if (reacted.includes("disabled")) { return }
                msg.channel.fetchMessage(msg.id)
                    .then(async function (message) {

                        var LikeReactions = message.reactions.first()
                        var reportReactions = message.reactions.last()

                        await msg.clearReactions()

                        var LikeCount = LikeReactions.count - 1
                        var reportCount = reportReactions.count - 1

                        if (LikeCount < 1 && reportCount < 1) { return console.log("Nobody voted.") }


                        var LikeUsers = [];
                        var reportUsers = [];

                        await LikeReactions.users.forEach(u => {
                            if (!u.bot) {
                                LikeUsers.push(u.username)
                            }
                        });

                        await reportReactions.users.forEach(u => {
                            if (!u.bot) {
                                reportUsers.push(u.username)
                            }
                        });

                        var duplicateUsers = LikeUsers.filter(function (val) {
                            return reportUsers.indexOf(val) != -1;
                        });


                        let duplicateUsersClean = duplicateUsers.map(function (e) { return "\`" + e + "\`" })

                        reportUsers = reportUsers.filter(val => !LikeUsers.includes(val));

                        let LikeUsersClean = LikeUsers.map(function (e) { return "\`" + e + "\`" });
                        let reportUsersClean = reportUsers.map(function (e) { return "\`" + e + "\`" });

                        var LikeCountuserRemove = LikeUsers.length
                        var reportCountuserRemove = reportUsers.length


                        var sucesstext = ""
                        if (LikeCountuserRemove > 0) { sucesstext += `🎉 ${LikeUsersClean.join(", ").replace(/, ([^,]*)$/, ' and $1')} liked the Image!` }
                        if (reportCountuserRemove > 0) { sucesstext += `\n${reportUsersClean.join(", ").replace(/, ([^,]*)$/, ' and $1')} reported the Image!` }
                        if (duplicateUsers.length > 0) { sucesstext += `\n\nHey ${duplicateUsersClean}, you can't Like **and** report. Your vote was defaulted to just **Like**.` }

                        if (LikeCountuserRemove > 0) { var likeSuccessOBJ = await Get(`https://fluffyart.cheeseboye.com/like.php?password=${config.fluffToken}&filename=${ResultObj.file.Filename}&count=${LikeCountuserRemove}`) }
                        if (reportCountuserRemove > 0) { var reportSuccessOBJ = await Get(`https://fluffyart.cheeseboye.com/report.php?password=${config.fluffToken}&filename=${ResultObj.file.Filename}&count=${reportCountuserRemove}`) }


                        var ReportPlusEmbed = client.scripts.getEmbed()
                            .setAuthor("Random Fluffyboi", "https://i.imgur.com/T9ACLM2.png", `https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)
                            .setColor(message.member.displayHexColor)
                            .setThumbnail(`https://fluffyart.cheeseboye.com/Thumbnails/${ResultObj.file.Filename}.png`)
                            .setImage(`https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)
                            .setFooter("Powered by fluffyart.cheeseboye.com")
                            .addField("Likes", ResultObj.file.Likes + LikeCountuserRemove, true)
                            .addField("Reports", ResultObj.file.Reports + reportCountuserRemove, true)
                            .setFooter(`${ResultObj.file.ID} | Powered by fluffyart.cheeseboye.com`)
                            .setTimestamp()
                        message.edit("", ReportPlusEmbed)

                        message.channel.send(sucesstext)
                    })

            }, VotingTime);
        })
    }
}