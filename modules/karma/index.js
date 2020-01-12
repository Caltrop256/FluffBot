'use strict';
const emojiIDs = ['562330233315917843', '562330227322388485', '586161821338042379', '586161821551951882', '586161821044441088'];
const karmaIDs = emojiIDs.slice(0, 2);
const pgsIDs = emojiIDs.slice(2, 5);
const Canvas = require('canvas');

module.exports = require(process.env.tropbot + '/genericModule.js');
module.exports.Info({
    name: 'karma',
    desc: ''
});
class KarmaInfo {
    constructor(upvotes = 0, downvotes = 0, platinum = 0, gold = 0, silver = 0) {
        this.upvotes = isNaN(upvotes) ? 0 : parseInt(upvotes);
        this.downvotes = isNaN(downvotes) ? 0 : parseInt(downvotes);
        this.platinum = isNaN(platinum) ? 0 : parseInt(platinum);
        this.gold = isNaN(gold) ? 0 : parseInt(gold);
        this.silver = isNaN(silver) ? 0 : parseInt(silver);
        this.valueOf = function () {
            return this.karma;
        }
    };
    get karma() {
        return this.upvotes - this.downvotes;
    }
    update(emojiID, added) {
        switch (emojiID) {
            case "562330233315917843": //upvotes
                this.upvotes += added ? 1 : -1;
                break;
            case "562330227322388485": //downvotes
                this.downvotes += added ? 1 : -1;
                break;
            case "586161821338042379": //platinum
                this.platinum += added ? 1 : 0;
                break;
            case "586161821551951882": //gold
                this.gold += added ? 1 : 0;
                break;
            case "586161821044441088": //silver
                this.silver += added ? 1 : 0;
                break;
            default:
                {
                    throw new Error('This should not appear. If it does, I give up');
                }
        };
        return this;
    }
    subtract(other) {
        return new KarmaInfo(this.upvotes - other.upvotes,
            this.downvotes - other.downvotes,
            Math.max(this.platinum - other.platinum, 0),
            Math.max(this.gold - other.gold, 0),
            Math.max(this.silver - other.silver, 0)
        );
    }
    add(other) {
        return new KarmaInfo(this.upvotes + other.upvotes,
            this.downvotes + other.downvotes,
            Math.max(this.platinum + other.platinum, 0),
            Math.max(this.gold + other.gold, 0),
            Math.max(this.silver + other.silver, 0)
        );
    }
};
var request = require("request");

function uploadVoteBuffer(buffer, upvotes, downvotes) {
    return new Promise((resolve, reject) => {
        var url = 'https://tropbot.cheeseboye.com/getThumbnail.php';
        var fileName = `${upvotes}_${downvotes}.png`;
        var options = {
            method: 'GET',
            url: url + `?upvotes=${upvotes}&downvotes=${downvotes}`,
            headers: {
                Authorization: 'BE9FC10F395D5973D54D707D9CD5FA1801172108C31D2FF09BEFDC3A70AB868619082A06975EACDA1D259622510881B7CCE464B5C743F4CE12666AB9EE7CDB81'
            }
        };
        request(options, function (err, resp, json) {
            if (err)
                return reject(err);
            if (JSON.parse(json))
                return resolve('https://tropbot.cheeseboye.com/images/' + fileName);
            options.method = 'POST';
            options.url = url;
            options.formData = {
                voteFile: {
                    value: buffer,
                    options: {
                        filename: fileName
                    }
                }
            };
            console.log(options);
            request(options, function (error, response, json) {
                if (error)
                    return reject(error);
                try {
                    var body = JSON.parse(json);
                    if (!body.success)
                        return reject(body);
                    resolve(body.info);
                } catch {
                    reject(json);
                }
            });
        });
    });
}
module.exports.ModuleSpecificCode = function (client) {

    async function getVoteBuffer(upvotes, downvotes) {
        //return new Promise((resolve, reject) => {
        //client.getUserKarma(userId).then(async k => {

        var up = upvotes; //!customUp && typeof customUp != 'number' ? k.up : customUp
        var down = downvotes; //!customDown && typeof customDown != 'number' ? k.down : customDown

        const canvas = Canvas.createCanvas(300, 300);
        const ctx = canvas.getContext('2d');

        const applyText = (canvas, text) => {
            let fontSize = 120;
            do {
                ctx.font = `${fontSize -= 10}px sans-serif`;
            } while (ctx.measureText(text).width > canvas.width / 1.7 && fontSize > 10);
            return ctx.font;
        };

        const background = await Canvas.loadImage(process.env.tropbot + '/assets/starboard_template.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        //ctx.textBaseline = "middle";

        ctx.font = applyText(canvas, `${up}`)
        ctx.fillText(`${up}`, canvas.width / 2.4, canvas.height / 2.6);

        ctx.font = applyText(canvas, `${down}`)
        ctx.fillText(`${down}`, canvas.width / 2.4, canvas.height / 1.07);

        return canvas.toBuffer();
        //});
        //});
    };
    client.userKarma = client.scripts.getCollection();

    function setCache(userId, karmaInfo) {
        client.userKarma.set(userId, karmaInfo);
    }

    function getTotalKarma() //TODO CACHE TOTAL KARMA OWO UWU PENIS
    {
        return new Promise((resolve, reject) => {
            var connection = client.scripts.getSQL();
            connection.query('SELECT sum(upvotes) upvotes, SUM(downvotes) downvotes, SUM(platinum) platinum, SUM(gold) gold, SUM(silver) silver FROM karma', (err, rows) => {
                if (err) return reject(err);
                var info = rows[0];
                resolve(new KarmaInfo(
                    info.upvotes,
                    info.downvotes,
                    info.platinum,
                    info.gold,
                    info.silver
                ));
            });

        });
    }

    function getUserKarma(userId) {
        return new Promise((resolve, reject) => {
            var cached = client.userKarma.get(userId);
            if (cached)
                return resolve(cached);
            var connection = client.scripts.getSQL(false);
            connection.query(`select * from karma WHERE id = '${userId}'`, (err, rows) => {
                if (err) return reject(err);
                if (!rows.length) return setUserKarma(userId, new KarmaInfo()).then(karmaInfo => resolve(karmaInfo)).catch(err => reject(err));
                var info = rows[0];
                var karmaInfo = new KarmaInfo(
                    info.upvotes,
                    info.downvotes,
                    info.platinum,
                    info.gold,
                    info.silver,
                );
                setCache(userId, karmaInfo);
                resolve(karmaInfo);
            });
        });
    };
    var botRemovedReacts = client.scripts.getCollection();

    function removeReact(react, userID) {
        react.remove(userID);
        botRemovedReacts.set(userID, react.emoji.id)
    }

    function setUserKarma(userId, karmaInfo) {
        return new Promise((resolve, reject) => {
            var { upvotes, downvotes, platinum, gold, silver } = karmaInfo;
            var connection = client.scripts.getSQL();

            connection.query(`
                INSERT INTO karma (id, upvotes, downvotes, platinum, gold, silver) 
                VALUES ('${userId}', ${upvotes}, ${downvotes}, ${platinum}, ${gold}, ${silver}) 
                ON DUPLICATE KEY UPDATE 
                    upvotes = ${upvotes},
                    downvotes = ${downvotes},
                    platinum = ${platinum},
                    gold = ${gold},
                    silver = ${silver};
            `, (err, rows) => {
                if (err) return reject(err);
                if (rows.affectedRows == 0) return reject(new Error('0 rows affected'));
                setCache(userId, karmaInfo);
                resolve(karmaInfo);
            });
        });
    }
    async function handleAwards(reaction, user) {

        var platinum, gold, silver;
        platinum = gold = silver = 0;
        var emote = reaction.emoji
        var name = emote.name;
        var id = emote.id;
        var cost = 0;
        var receivingUser = reaction.message.member;
        if (!name.startsWith('reddit') || (name.length < 7)) return;

        if (id == '586161821338042379') {
            cost = client.cfg.platinum
            platinum++;
        } else if (id == '586161821551951882') {
            cost = client.cfg.gold;
            gold++;
        } else if (id == '586161821044441088') {
            cost = client.cfg.silver;
            silver++;
        } else {
            return;
        }
        if (!client.modules.get('economy').enabled) {
            removeReact(reaction, user.id);
            user.send(`The \`economy\` module is currently disabled so features using it are also disabled`);
            return false;
        }
        /*if(user.id === receivingUser.id){
            reaction.remove();
            user.send(`You cannot give yourself awards`);
            return false;
        }*/

        var money = await client.getMoney(user.id);

        if (money.coins < cost) {
            user.send(`You do not have enough ${client.cfg.curName} to give **${emote}** (${money.coins}/${cost})`);
            if (!money.hasEntry) client.updateMoney(user.id, 0);
            return false;
        }
        var currKarma = await getUserKarma(receivingUser.id);
        currKarma.platinum += platinum;
        currKarma.gold += gold;
        currKarma.silver += silver;
        await client.updateMoney(user.id, -cost);
        await setUserKarma(receivingUser.id, currKarma);
        user.send(`Successfully given ${emote} to \`${receivingUser.displayName}\`\n\`${cost} ${client.cfg.curName}\` has been deducted from your Account.`);
        return true;
    };


    async function handleReactRemoveAll(message) {
        var userID = message.author.id;
        var messageID = message.id;
        var cachedReacts = client.messageReactCache.get(messageID);
        if (!cachedReacts)
            return;

        var karmaInfo = await getUserKarma(userID);
        for (var [cachedID, cachedReact] of cachedReacts) {
            for (var i = 0; i < cachedReact.count; i++)
                karmaInfo.update(cachedReact.emoji.id, false);
        }
        await setUserKarma(userID, karmaInfo);
        client.messageReactCache.delete(messageID);

        var starboardEntry = client.starboardCollection.get(messageID);
        console.log(!!starboardEntry);
        if (!starboardEntry)
            return;
        client.starboardCollection.delete(messageID);
        await starboardEntry.delete();
    }
    var starboardArrayQueue = [];

    function checkForRateLimit(reaction, userID) {
        var result = !rateLimitHandler(userID);
        console.log(result);
        return result;
    }
    async function handleReactUpdate(user, reaction, added) {
        if (!emojiIDs.includes(reaction.emoji.id)) return;


        var message = reaction.message;
        var author = message.author;
        var filteredReacts = message.reactions.filter(react => emojiIDs.includes(react.emoji.id));
        client.messageReactCache.set(message.id, filteredReacts);

        var upvotesReact = filteredReacts.get('upvote:562330233315917843');
        var upvotes = upvotesReact ? upvotesReact.users.filter(user => !user.bot).size : 0;
        var downvotesReact = filteredReacts.get('downvote:562330227322388485')
        var downvotes = downvotesReact ? downvotesReact.users.filter(user => !user.bot).size : 0;
        var platinumReact = filteredReacts.get('redditplatinum:586161821338042379')
        var platinum = platinumReact ? platinumReact.users.filter(user => !user.bot).size : 0;
        var goldReact = filteredReacts.get('redditgold:586161821551951882')
        var gold = goldReact ? goldReact.users.filter(user => !user.bot).size : 0;
        var silverReact = filteredReacts.get('redditsilver:586161821044441088')
        var silver = silverReact ? silverReact.users.filter(user => !user.bot).size : 0;


        var karmaInfo = await getUserKarma(author.id);
        if (karmaIDs.includes(reaction.emoji.id))
            await setUserKarma(author.id, karmaInfo.update(reaction.emoji.id, added));

        var msgKarma = new KarmaInfo(upvotes, downvotes, platinum, gold, silver);
        starboardArrayQueue.push(async () => await handleStarboard(message, msgKarma));
        //if(msgKarma.up >= client.cfg.minStarboardScore) client.starboardMessage(client, reaction.message);
    };

    async function reactionMaster3000() {
        var post = client.starboard.get(reaction.message.id)
        if (post) {
            var type = ""
            var msg = reaction.message
            var up = 0;
            var down = 0;
            var plat = 0;
            var gold = 0;
            var silver = 0;
            msg.reactions.forEach(r => {
                switch (r.emoji.id) {
                    case "562330233315917843":
                        up = r.users.size
                        type = "up"
                        break;
                    case "562330227322388485":
                        down = r.users.size
                        type = "down"
                        break;
                    case "586161821338042379":
                        plat = r.users.size
                        type = "plat"
                        break;
                    case "586161821551951882":
                        gold = r.users.size
                        type = "gold"
                        break;
                    case "586161821044441088":
                        silver = r.users.size
                        type = "silver"
                        break;
                }
            })
            var obj = {
                id: msg.id,
                starboardid: post.starboardid,
                upvotes: up,
                downvotes: down,
                plat: plat,
                gold: gold,
                silver: silver
            }
            client.handleKarmaObj(type, reaction.message.author.id, 1)

            var starboardChannel = client.channels.get(client.cfg.starboardChannel)
            if (up - down >= client.cfg.minStarboardScore) {
                var upvoteEmoji = client.emojis.get("562330233315917843")

                const embeds = msg.embeds;
                const attachments = msg.attachments;

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

                var Awards = ``
                if (obj.plat > 0) {
                    var platemoji = client.emojis.get("586161821338042379");
                    Awards += `${platemoji}x${obj.plat}\n`
                }
                if (obj.gold > 0) {
                    var goldemoji = client.emojis.get("586161821551951882");
                    Awards += `${goldemoji}x${obj.gold}\n`
                }
                if (obj.silver > 0) {
                    var silveremoji = client.emojis.get("586161821044441088");
                    Awards += `${silveremoji}x${obj.silver}\n`
                }
                var starboardembed = new Discord.RichEmbed()
                    .setAuthor(msg.member.displayName, msg.author.displayAvatarURL, msg.url)
                    .setFooter(`Score: ${up - down}`, upvoteEmoji.url)
                    .setDescription(`[[Jump to Message](${msg.url})]`)
                    .setThumbnail(msg.author.displayAvatarURL)
                    .setImage(eURL)
                    .setTimestamp()
                if (msg.content.length > 0) starboardembed.addField(`Content`, msg.content)
                if (Awards.length > 0) starboardembed.addField("Awards", Awards)
                if (msg.author.displayHexColor) { starboardembed.setColor(msg.author.displayHexColor) } else { starboardembed.setColor(0xFFD700) }

                const canvas = Canvas.createCanvas(300, 300);
                const ctx = canvas.getContext('2d');

                const background = await Canvas.loadImage('./images/starboard_template.png');
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#FFD700';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                ctx.font = '128px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${up.toString()}`, canvas.width / 2, canvas.height / 2.6);

                ctx.font = '128px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${down.toString()}`, canvas.width / 2, canvas.height / 1.07);

                var randID = Math.floor(Math.random() * 10000)

                starboardembed.thumbnail = {
                    url: `attachment://votes${randID}.png`
                }

                if (post.starboardid) {
                    console.log("edit post")
                    starboardChannel = client.channels.get(client.cfg.starboardChannel)
                    starboardChannel.fetchMessage(post.starboardid).then(message => {
                        message.delete(100)
                        starboardChannel.send({ embed: starboardembed, files: [{ attachment: canvas.toBuffer(), name: `votes${randID}.png` }] }).then(message => {
                            obj.starboardid = message.id
                            client.starboard.set(msg.id, obj)
                        });
                    })
                } else {
                    console.log("new post")
                    starboardChannel = client.channels.get(client.cfg.starboardChannel)
                    starboardChannel.send({ embed: starboardembed, files: [{ attachment: canvas.toBuffer(), name: `votes${randID}.png` }] }).then(message => {
                        obj.starboardid = message.id
                        client.starboard.set(msg.id, obj)
                    })
                }
            } else if (up - down < client.cfg.minStarboardScore && post.starboardid) {
                starboardChannel = client.channels.get(client.cfg.starboardChannel)
                starboardChannel.fetchMessage(post.starboardid).then(message => {
                    message.delete(200)
                    obj.starboardid = null
                    client.starboard.set(msg.id, obj)
                })
            }
        } else {
            var msg = reaction.message
            var up = 0;
            var down = 0;
            var plat = 0;
            var gold = 0;
            var silver = 0;
            msg.reactions.forEach(r => {
                switch (r.emoji.id) {
                    case "562330233315917843":
                        up = r.users.size
                        type = "up"
                        break;
                    case "562330227322388485":
                        down = r.users.size
                        type = "down"
                        break;
                    case "586161821338042379":
                        plat = r.users.size
                        type = "plat"
                        break;
                    case "586161821551951882":
                        gold = r.users.size
                        type = "gold"
                        break;
                    case "586161821044441088":
                        silver = r.users.size
                        type = "silver"
                        break;
                }
            })
            var obj = {
                id: msg.id,
                starboardid: null,
                upvotes: up,
                downvotes: down,
                plat: plat,
                gold: gold,
                silver: silver
            }
            client.handleKarmaObj(type, reaction.message.author.id, 1)
            client.starboard.set(msg.id, obj)
        }
    }

    async function handleStarboard(msg, karmaInfo, starboardEntry = client.starboardCollection.get(msg.id)) {
        if (karmaInfo >= client.cfg.minStarboardScore) {
            var upvoteEmoji = client.emojis.get("562330233315917843");
            let eURL = ''
            const embeds = msg.embeds;
            const attachments = msg.attachments;
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
            var Awards = ``
            var platinum = client.emojis.get("586161821338042379");
            var gold = client.emojis.get("586161821551951882");
            var silver = client.emojis.get("586161821044441088");
            Awards += karmaInfo.platinum ? `${platinum}x${karmaInfo.platinum}\n` : '';
            Awards += karmaInfo.gold ? `${gold}x${karmaInfo.gold}\n` : '';
            Awards += karmaInfo.silver ? `${silver}x${karmaInfo.silver}\n` : '';
            var buffer = await getVoteBuffer(karmaInfo.upvotes, karmaInfo.downvotes);
            var bufferURL = await uploadVoteBuffer(buffer, karmaInfo.upvotes, karmaInfo.downvotes);
            var starboardEmbed = client.scripts.getEmbed()
                .setAuthor(msg.member.displayName, msg.author.displayAvatarURL, msg.url)
                .setFooter(`Score: ${karmaInfo.karma}`, upvoteEmoji.url)
                .setDescription(`[[Jump to Message](${msg.url})]`)
                .setThumbnail(bufferURL)
                .setImage(eURL)
                .setTimestamp()

            if (msg.content.length) starboardEmbed.addField(`Content`, msg.content)
            if (Awards.length) starboardEmbed.addField("Awards", Awards)
            starboardEmbed.setColor(msg.member.displayColor ? msg.member.displayColor : 0xFFD700);
            if (starboardEntry)
                return await starboardEntry.edit({ embed: starboardEmbed });
            var starboardChannel = client.channels.get('562337386701520897');
            var starboardMessage = await starboardChannel.send({ embed: starboardEmbed });
            client.starboardCollection.set(msg.id, starboardMessage);
        } else {
            if (!starboardEntry) return;
            client.starboardCollection.delete(msg.id);
            await starboardEntry.delete();
        }
    }
    var rateLimitedUsers = [];
    var userUpvoteCount = client.scripts.getCollection();
    const upvoteRateLimitCount = 5;
    const upvoteRateLimitTime = 2000;
    const upvoteRateLimitCooldown = (upvoteRateLimitTime * (upvoteRateLimitCount * 2));

    function rateLimitHandler(userID) {
        console.log('heck');
        if (rateLimitedUsers.includes(userID))
            return;

        if ((userUpvoteCount.get(userID) || {}).count > upvoteRateLimitCount) {
            var msg;
            client.fetchUser(userID).then(user => user.send(`Rate Limited Adding Karma Reactions For ${(upvoteRateLimitCooldown / 1000)} Seconds`).then(message => msg = message));
            console.log(`Rate Limiting ${userID} For ${(upvoteRateLimitCooldown / 1000)} Seconds`);
            var index = rateLimitedUsers.push(userID) - 1;
            setTimeout(() => {
                if (msg)
                    msg.edit(`Rate Limit Ended`);
                console.log(`Rate Limit Ended For ${userID}`);
                rateLimitedUsers.splice(index, 1)
            }, upvoteRateLimitCooldown)
            return false;
        } else {
            //console.log(userUpvoteCount.get(userID));
            var userInfo = userUpvoteCount.get(userID) || { count: 0, timeout: 0 };
            var timeout = Math.max(0, userInfo.timeout - Date.now()) + upvoteRateLimitTime;
            //console.log(userInfo.count);
            userInfo.count++;
            console.log(userInfo.count + '(+1)');
            userInfo.timeout = Date.now() + timeout;
            //console.log(timeout);
            //console.log(new Date(userInfo.timeout));
            userUpvoteCount.set(userID, userInfo);
            setTimeout(() => {

                var uInfo = userUpvoteCount.get(userID);
                uInfo.count--;
                console.log(uInfo.count + '(-1)');
                userUpvoteCount.set(userID, uInfo);
            }, timeout);
            return true;
        }
    }
    async function getMessageKarma(message) {
        if (!message.reactions.some(reaction => emojiIDs.includes(reaction.emoji.id))) return new KarmaInfo(0, 0, 0, 0, 0);


        var author = message.author;
        var filteredReacts = message.reactions.filter(react => emojiIDs.includes(react.emoji.id));
        client.messageReactCache.set(message.id, filteredReacts);

        var upvotesReact = filteredReacts.get('upvote:562330233315917843');
        var upvotes = upvotesReact ? (await upvotesReact.fetchUsers()).filter(user => !user.bot).size : 0;
        var downvotesReact = filteredReacts.get('downvote:562330227322388485')
        var downvotes = downvotesReact ? (await downvotesReact.fetchUsers()).filter(user => !user.bot).size : 0;
        var platinumReact = filteredReacts.get('redditplatinum:586161821338042379')
        var platinum = platinumReact ? (await platinumReact.fetchUsers()).filter(user => !user.bot).size : 0;
        var goldReact = filteredReacts.get('redditgold:586161821551951882')
        var gold = goldReact ? (await goldReact.fetchUsers()).filter(user => !user.bot).size : 0;
        var silverReact = filteredReacts.get('redditsilver:586161821044441088')
        var silver = silverReact ? (await silverReact.fetchUsers()).filter(user => !user.bot).size : 0;
        return new KarmaInfo(upvotes, downvotes, platinum, gold, silver);
    }
    client.starboardArrayQueue = starboardArrayQueue;
    client.getMessageKarma = getMessageKarma;
    client.getTotalKarma = getTotalKarma;
    client.uploadVoteBuffer = uploadVoteBuffer;
    client.removeReact = removeReact;
    client.rateLimitHandler = rateLimitHandler;
    client.botRemovedReacts = botRemovedReacts;
    client.checkForRateLimit = checkForRateLimit;
    client.starboardCollection = client.scripts.getCollection();
    client.messageReactCache = client.scripts.getCollection();
    client.getUserKarma = getUserKarma;
    client.setUserKarma = setUserKarma;
    client.getVoteBuffer = getVoteBuffer;
    client.handleStarboard = handleStarboard;
    client.handleReactUpdate = handleReactUpdate;
    client.handleReactRemoveAll = handleReactRemoveAll;
    client.handleAwards = handleAwards;
    client.Karma = KarmaInfo;
    client.isStarboardReady = false;
    (async function starboardQueue() {
        if (client.isStarboardReady && starboardArrayQueue.length)
            await starboardArrayQueue.shift()();
        setTimeout(starboardQueue, 30);
    })();
}