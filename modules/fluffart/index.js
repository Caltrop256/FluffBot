'use strict';

module.exports = require(process.env.tropbot + '/genericModule.js');
module.exports.Info({
    name: 'fluffart',
    desc: 'module utilizing <@152041181704880128>\'s fluffart site'
});
const https = require('https')
module.exports.ModuleSpecificCode = function(client) {
    async function avatarFunc() {
        function Get(URL) {
            return new Promise((resolve, reject) => {
                var Done = false;
                https.get(URL, (resp) => {
                    var data = '';
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
            console.log(console.color.red(`[META]`), `Avatar changed to => https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)

            if (ResultObj.file.Extension == "png" || ResultObj.file.Extension == "gif" || ResultObj.file.Extension == "jpg") {
                break;
            }
        }
        var newUrl = `https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`;
        client.user.setAvatar(newUrl).then(() => {
            client.subscriptions.avatar.forEach(userID => {
                var avatarEmbed = client.scripts.getEmbed()
                    .setAuthor(`My New Avatar`, newUrl, newUrl)
                    .setImage(newUrl)
                    .setTimestamp()
                    .setFooter(`$f{ResultObj.file.ID} | Powered by fluffyart.cheeseboye.com`)
                    .setColor(client.constants.neonGreen.hex);
                client.fetchUser(userID).then(User => {
                    User.send(`If you would like to stop being notified every time I change my avatar, you can use \`${client.cfg.prefix[0]}avatarnotify\` again. Also, if you feel like the current image is not appropriate, please privately DM ***The ._.dministrator#9187*** about it and don't publicly mention it and report it.`, { embed: avatarEmbed })
                });

            });
        }).catch(err => console.log(err));
    }

    function getSubscriptions(subName) {
        var connection = client.scripts.getSQL();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT ${subName} FROM subscriptions WHERE ${subName} IS NOT NULL`, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            })
        });
    }

    function setSubscription(subName, userID, toDelete) {
        var connection = client.scripts.getSQL();
        var SQL = toDelete ? `DELETE FROM subscriptions WHERE  ${subName}=${userID}` : `INSERT INTO subscriptions (${subName}) VALUES (${userID});`;
        return new Promise((resolve, reject) => {
            connection.query(SQL, (err, result) => {
                if (err) return reject(err);
                resolve(!!result.affectedRows);
            });
        });
    }
    (async() =>
        client.subscriptions = {
            avatar: (await getSubscriptions('avatar')).map(x => x.avatar.toString())
        }
    )();
    client.getSubscriptions = getSubscriptions;
    client.setSubscription = setSubscription;
    client.avatarFunc = avatarFunc;
    this.timedFunctions.set(avatarFunc, 900000);
}