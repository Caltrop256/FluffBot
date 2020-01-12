/**type
 *  0:coins
 *  1:karma
 *  2:pgs
 * pgsType
 *  0:p
 *  1:g
 *  2:s
 **/
var scripts, cfg;
//const typeArr = ['totalMoney','karmaInfo','pgsType'];
const pgsArr = ['platinum', 'gold', 'silver'];
const sqlSelectArr = ['*', 'upvotes, downvotes', pgsArr.join(',')]
//const sqlTableArr = ['coins','karma','karma']; type ? karma : coins
const sqlOrderArr = ['coins', 'upvotes-downvotes', '{0}'];
class CustomEmoji {
    constructor(id, name, url) {
        this.id = id;
        this.name = name;
        this.url = url;
    }
    toString() {
        return `<:${this.name}:${this.id}>`
    }
}
class CustomUser {
    constructor(id, displayName, displayHexColor, displayAvatarURL, username, discriminator, bot) {
        this.id = id;
        this.displayName = displayName || 'Unknown User';
        this.displayHexColor = displayHexColor || '#000000';
        this.displayAvatarURL = displayAvatarURL || 'https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';
        this.username = username || 'Unknown User';
        this.discriminator = discriminator || '0000';
        this.bot = bot || false;
    }
    toString() {
        return `<@${this.id}>`;
    }

}
class DashBoardInfo {
    constructor(type, client, pgsType) {
        this.type = type;
        var emojis = {
            upvote: client.emojis.get('562330233315917843'),
            downvote: client.emojis.get('562330227322388485'),
            platinum: client.emojis.get('586161821338042379'),
            gold: client.emojis.get('586161821551951882'),
            silver: client.emojis.get('586161821044441088')
        };
        this.emojis = {};
        for (var emoji in emojis) {
            var emojiObj = emojis[emoji];
            this.emojis[emoji] = new CustomEmoji(emojiObj.id, emojiObj.name, emojiObj.url);
        }
        this.pgsType = pgsType;
    }
    addEntries(guild, entryArr) {
        var entries = [];
        var users = scripts.getCollection();
        this.users = [];
        for (var entry of entryArr) {
            var user = users.get(entry.id);
            if (!user) {
                var member = guild.members.get(entry.id) || {};
                var mUser = member.user || {};
                user = new CustomUser(
                    entry.id,
                    member.displayName,
                    member.displayHexColor,
                    mUser.displayAvatarURL,
                    mUser.username,
                    mUser.discriminator,
                    mUser.bot
                );
                users.set(entry.id, user);
                this.users.push(user);
            }

            entries.push(new Entry(this, this.type, entries.length, entry));
        }
        this.entries = entries;

    }
}
class Entry {
    constructor(board, type, index, entryObj) {
        this.board = board;
        this.type = type;
        this.index = index;
        this.entryObj = entryObj;
    }
    toString() {
        var user = this.board.users.find((user) => user.id === this.entryObj.id);
        var emojis = this.board.emojis;
        var pgsType = this.board.pgsType;
        var toDisplay = '';
        if (!this.type)
            toDisplay = `${scripts.numComma(this.entryObj.coins)}${cfg.curName}`;
        else if (this.type == 1)
            toDisplay = `${this.entryObj.upvotes - this.entryObj.downvotes} Karma`;
        else
            if (pgsType === 0)
                toDisplay = `${scripts.numComma(this.entryObj.platinum)} ${emojis.platinum}`;
            else if (pgsType === 1)
                toDisplay = `${scripts.numComma(this.entryObj.gold)} ${emojis.gold}`;
            else
                toDisplay = `${scripts.numComma(this.entryObj.silver)} ${emojis.silver}`;
        //toReturn +=  // ${upvote}**${client.scripts.numComma(row.up - row.down)}**\n`.replace(rowMember.displayName, rowMember ? rowMember.toString() : 'Unknown User')
        return `\`${scripts.ordinalSuffix(this.index + 1)}\` ${user} : **${toDisplay}**`;
    }


}
module.exports = require(process.env.tropbot + '/genericModule.js');
module.exports.Info({
    name: 'dashboard',
    desc: ''
});
module.exports.ModuleSpecificCode = function (client) {
    scripts = client.scripts;
    cfg = client.cfg;
    async function getBoard(type, guild, pgsType) {
        var moduleRequired = type ? 'karma' : 'economy';
        if (!client.modules.get(moduleRequired).enabled)
            return false;
        var toReturn = new DashBoardInfo(type, client, pgsType);
        if (type)
            toReturn.totalKarma = await client.getTotalKarma();
        else
            toReturn.totalMoney = await client.getTotalMoney();
        var connection = client.scripts.getSQL();
        var SQL = 'SELECT {0} FROM {1} ORDER BY {2} DESC'.format((type ? 'id, ' : '') + sqlSelectArr[type], type ? 'karma' : 'coins', sqlOrderArr[type].replace('{0}', pgsArr[pgsType]))
        var rows = await new Promise((resolve, reject) =>
            connection.query(SQL, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }));
        var entries = [];
        toReturn.addEntries(guild, rows);
        /*for(var row of rows)
        {
            entries.push(new Entry(type,entries.length,row));
        }
        toReturn.entries = entries;*/
        return toReturn;
    }
    client.getBoard = getBoard;
}