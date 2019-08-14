/*

    person reading this mad cute

*/

console.clear()
const Discord = require('discord.js');
const {Util} = require('discord.js');
const client = new Discord.Client({autoReconnect: true, disableEveryone: true});
const config = require("./commands/json/config.json");
const prettyMs = require('pretty-ms');
const fs = require('fs');
const https = require('https');
var similarity = require("similarity");
const matchSorter = require('match-sorter')
const ytdl = require('ytdl-core');
var logger = require('logger').createLogger('./logs/crashreport.log');
var mysql = require('mysql');
if(config.maintenance == false) {
    var connection = mysql.createConnection({
        host     : `localhost`,
        port     : `3306`,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb,
        multipleStatements: true
    });
}else {
    var connection = mysql.createConnection({
        host     : config.mySQLHost,
        port     : config.mySQLPort,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb,
        multipleStatements: true
    });
}
console.color = require('colors')

client.polls = new Discord.Collection()

client.invites = {};

client.spam = {};
client.spam.lreceivedMessageChannel = {};
client.spam.lreceivedMessageUser = {};
client.spam.user = {};

client.cfg = {};
connection.query(`SELECT * FROM config`, (err, rows) => {
    if(err) throw err;
    rows.forEach(row => {
        client.cfg[row.config] = row.value
    })
    console.table(client.cfg)
});
client.cmd = {}
client.cmd.permissions = [
    {
        position: 0,
        name: "None",
        perm: "",
        group: "Users"
    }, {
        position: 1,
        name: "Manage Messages",
        perm: "MANAGE_MESSAGES",
        group: "Moderators"
    }, {
        position: 2,
        name: "Manage Guild",
        perm: "MANAGE_GUILD",
        group: "Moderators"
    }, {
        position: 3,
        name: "Administrator",
        perm: "ADMINISTRATOR",
        group: "Administrators"
    }, {
        position: 4,
        name: "Guild Owner",
        perm: "",
        group: "Guild Owners"
    }, {
        position: 5,
        name: "Caltrop",
        perm: "",
        group: "Bot Owners"
    }
]


let channel_id_color = "562328013371605012"; 
let message_id_color = client.cfg.color1;

let channel_id_color2 = "562328013371605012"; 
let message_id_color2 = client.cfg.color2;

let channel_id_other = "562328013371605012"; 
let message_id_other = client.cfg.other1;

let channel_id = "562586739819151370"; 
let message_id = client.cfg.ruleAccept; //id of the confirmRuleEmbed message
let block_logs_id = "561251245525041152";

var prefix = client.cfg.prefix


const talkedRecently = new Set();

const embedBlack = 0x000000
const embedGrey = 0xC7C7C7
const embedMoss = 0x2C452E
const embedBright_Green = 0x11A11D
const embedGreen = 0x74B979
const embedNeon_Green = 0x1DFF2D
const embedTurquoise = 0x60D6AD
const embedAqua = 0x94CECC
const embedCyan = 0x2CE8E2
const embedTeal = 0x23A09C
const embedSky_Blue = 0x76C7F2
const embedBlue = 0x0490DA
const embedOcean_Blue = 0x0671A9
const embedUltramarine = 0x0C37DE
const embedDarkPurple = 0x7133CB
const embedPeriwinkle = 0xCCCCFF
const embedMagenta = 0x9212DE
const embedLight_Magenta = 0xDAA2FC
const embedViolet = 0xE828FF
const embedBeige = 0xF6EFC8
const embedPeach = 0xE3CEDA
const embedPink = 0xE699C5
const embedHot_Pink = 0xE56FB3
const embedNeon_Pink = 0xFF0093
const embedRed = 0xFC4B4B
const embedReder = 0xFF0000
const embedDark_Orange = 0x9D4D25
const embedPerfect_Orange = 0xFF7D00 //Gusta color uwu
const embedBright_Orange = 0xFFB944
const embedOrange = 0xFFDFAB
const embedYellow = 0xD8C100
const embedBright_Yellow = 0xFFE400


fs.writeFileSync('./commands/json/dar.json',`{\n"exit": false\n}`);

function avatarFunc() {
    if(client.cfg.autoAvatar == "true") {
        changeAvatar()

            async function changeAvatar() {
                
            function Get(URL) {
                return new Promise ((resolve, reject) => {
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
                    console.log(console.color.red(`[META]`), `Avatar changed to => https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`)

                    if(ResultObj.file.Extension == "png" || ResultObj.file.Extension == "gif" || ResultObj.file.Extension == "jpg") {
                        break;
                    }
                }
            client.user.setAvatar(`https://fluffyart.cheeseboye.com/Images/${ResultObj.file.Filename}.${ResultObj.file.Extension}`).catch(err => console.log(err));
            }

            
        }
    var MainGuild = client.guilds.get("562324876330008576")
    MainGuild.members.forEach(m => {
        if(!m.roles.has('562327403477729285') && !m.user.bot) {
            m.addRole('562327403477729285', `Missing Castle Town Residents role`)
            console.log(m.user.username + 'missing CTR role.')
        }
    })
}
setInterval(avatarFunc, 900000);

client.starboard = new Discord.Collection()

/*
    1 Pos:

    1 = valid

    2 Pos:
    0 = lost money
    1 = got money
    2 = unknown

    3 Pos:

    0 = unknown
    1 = drop
    2 = flip
    3 = give
    4 = award bought
    5 = taxes
    6 = debug
*/
client.addEntry = function(ID,Value,His) {
    let DateChanged = new Date(Date.now())
    connection.query("INSERT INTO `usercoinchange` (`DateChanged`, `UserID`, `Coins`, `his`) VALUES ('"+DateChanged.toISOString()+"', '"+ID+"', '"+Value+"', '"+His+"');", function (error, result, fields) {
        if (error) return console.log(error);
    });
}

client.lastSeenCollec = new Discord.Collection()
client.lastSeen = function(member, activity) {
    if(!member) return
    var userOBJ = {
        id: member.user.id,
        activity: activity.toString(),
        date: Date.now(),
        tag: member.user.tag
    }
    client.lastSeenCollec.set(member.user.id, userOBJ);
}
function lastSeenUpdate() {
    console.table(client.lastSeenCollec)
    connection.query(`SELECT * FROM lastseen`, (err, rows) => {
        if(err) throw err;
        var sql = ``;
        var escapeArr = [];
        client.lastSeenCollec.forEach(user => {
            var matchrow = rows.find(r => r.id == user.id)
            if(!matchrow) {
                sql += `INSERT INTO lastseen (id, activity, date, tag) VALUES ('${user.id}', ?, ${user.date}, ?); `;
                escapeArr.push(user.activity);
                escapeArr.push(user.tag);
            } else {
                sql += `UPDATE lastseen SET activity = ?, date = ${user.date}, tag = ? WHERE id = '${user.id}'; `; 
                escapeArr.push(user.activity);
                escapeArr.push(user.tag);
            } 
        })
        console.log(escapeArr)
        connection.query(sql, escapeArr)
    });
}
setInterval(lastSeenUpdate, 900000);

function removeAccents(str) {
    let accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    let accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    str = str.split('');
    str.forEach((letter, index) => {
      let i = accents.indexOf(letter);
      if (i != -1) {
        str[index] = accentsOut[i];
      }
    })
    return str.join('');
}

client.swearDetect = function(str) {
    str = removeAccents(str)
    var replaced = false
    var map = 0
    const friendlyWords = ['Fettuccine Alfredo', 'Mango Yogurt', 'amigo', 'cuddlebuddy', 'fella', 'neighbour', 'friendo', 'buddy', 'companion', 'partner', 'acquaintance', 'ally', 'associate', 'colleague', 'chum', 'cohort', 'compatriot', 'comrade', 'consort', 'mate', 'pal', 'fellow Ralsei-enthusiast', 'cutie'];
    const friendlyAdj = ['cute', 'affectionate', 'ambitious', 'amiable', 'compassionate', 'considerate', 'courageous', 'courteous', 'diligent', 'empathetic','generous', 'passionate', 'reliable', 'sensible', 'sympathetic', 'witty']
    str = str.replace(/\b(?:sand)?(?:n)[aeiou1]{1,}[g6b]{1,}[aeiou16]{1,}r?s?\b/gim, function(token){map += 1; replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
    str = str.replace(/\bf[a|e]{1,}g{1,}(o{1,})?(t{1,})?/gi, function(token){map += 2;replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
    str = str.replace(/tra{1,}n{1,}(!?s)?((y{1,})|(ie{1,}))/gi, function(token){map += 4;replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});  
    str = str.replace(/;;friend/gi, function(token){map += 8;replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
    str = str.replace(/;;adj/gi, function(token){map += 16;replaced = true; return `${friendlyAdj[Math.floor(Math.random() * friendlyAdj.length)]}`;}); 
    str = str.replace(/ra{1,}g( )?(head|hat)/gi, function(token){map += 32;replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
    str = str.replace(/go{1,}a{1,}t( )?[v|f]uc[c|k](er)?/gi, function(token){map += 64;replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
    str = str.replace(/cam{1,}el( )?[v|f]uc[c|k](er)?/gi, function(token){map += 128;replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
    str = str.replace(/go{2,}(c|k)/gi, function(token){map += 256;replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
    str = str.replace(/\bho{1,}nc?ky{1,}\b/gi, function(token){map += 512;replaced = true; return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`;});
    str = str.replace(/(re+)(t|d)a+r+(t|d)\b/gi, function(token){map += 1024;replaced = true;return `${friendlyWords[Math.floor(Math.random() * friendlyWords.length)]}`});
    str = str.replace(/(re+)(t|d)a+r+(t|d)(e+)?(t|d)?/gi, function(token){map += 1024;replaced = true;return `${friendlyAdj[Math.floor(Math.random() * friendlyAdj.length)]}`});
    return {string: str, replaced: replaced, bitmap: map}
}


fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
});


const cooldowns = new Discord.Collection();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const EventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

console.table(client.commands)
console.table(EventFiles)

client.queue = new Map();

client.handleVideo = async function(video, receivedMessage, voiceChannel, playlist = false) {
    client.serverQueue = client.queue.get(receivedMessage.guild.id);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!client.serverQueue) {
        console.log(`Manual construction`)
		client.serverQueue = {
			textChannel: receivedMessage.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		client.queue.set(receivedMessage.guild.id, client.serverQueue);

        client.serverQueue.songs.push(song);

		try {
			let vcConnection = await voiceChannel.join();
            console.log(vcConnection)
            client.serverQueue.connection = vcConnection;
            client.play(receivedMessage.guild, client.serverQueue.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			client.queue.delete(receivedMessage.guild.id);
			return receivedMessage.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
        console.log(`adding to playlist`)
		client.serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return receivedMessage.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

client.play = async function(guild, song) {
    client.serverQueue = client.queue.get(guild.id);

	if (!song) {
		client.serverQueue.voiceChannel.leave();
		client.queue.delete(guild.id);
		return;
	}

	const dispatcher = client.serverQueue.connection.playStream(ytdl(song.url), {filter: "audioonly"})
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			client.serverQueue.songs.shift();
			client.play(guild, client.serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(client.serverQueue.volume / 5);

	client.serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}

client.userKarma = new Discord.Collection()
connection.query(`SELECT * FROM karma`, (err, rows) => {
    if(err) throw err;
    var RowArray = rows
    connection.query(`SELECT * FROM premReward`, (err, awardrows) => {
        if(err) throw err;
        var AwardArray = awardrows;
        for (i = 0; i < RowArray.length; i++) {
            var r = RowArray[i] 
            var obj = {id: r.id, up: r.up, down: r.down, plat: r.plat, gold: r.gold, silver: r.silver}
            AwardArray.forEach(a => {
                if(a.id == r.id) {
                    obj.plat = a.plat;
                    obj.gold = a.gold;
                    obj.silver = a.silver;
                }
            })
            client.userKarma.set(r.id, obj)
        };
    });
});
client.handleKarmaObj = function(type, userid, amt) {
    var collec = client.userKarma.get(userid)
    if(collec) {
        
        switch(type) {
            case "up" :
                collec.up += amt
                break;
            case "down" :
                collec.down += amt
                break;
            case "plat" :
                collec.plat += amt
                break;
            case "gold" :
                collec.gold += amt
                break;
            case "silver" :
                collec.silver += amt
        
        client.userKarma.set(userid, collec)
        }
    } else {
        client.userKarma.set(userid, {id: userid, up: 0, down: 0, plat: 0, gold: 0, silver: 0})
    }
}
function karmaUpdate() {
    console.log(client.userKarma.size)
    connection.query(`SELECT * FROM karma`, (err, rows) => {
        if(err) throw err;
        var sql = ``;
        client.userKarma.forEach(user => {
            var matchrow = rows.find(r => r.id == user.id)
            if(!matchrow) {
                sql += `INSERT INTO karma (id, up, down, plat, gold, silver) VALUES ('${user.id}', ${user.up}, ${user.down}, ${user.plat}, ${user.gold}, ${user.silver}); `
            } else sql += `UPDATE karma SET up = ${user.up}, down = ${user.down}, plat = ${user.plat}, gold = ${user.gold}, silver = ${user.silver} WHERE id = '${user.id}'; `
        })
       if(sql) connection.query(sql)
    });
}
setInterval(karmaUpdate, 300000);



/*
        MATCHES
Layer One: Direction Mentions / exact IDs
Layer Two: Exact Matches of Username / Exact Matches of Nickname / Exact Matches of 'Username#Discriminator'
Layer Three: Similarity Matching System (compares arguements to list of all usernames / nicknames), ranked in Order by the following:
    1-Case sensitive equals: Case-sensitive equality trumps all. Only applies if all letters are the same. (ex. "Caltrop" would match "Caltrop", but not "caltrop")
    2-Equals: Case-insensitive equality. (ex. "Caltrop" would match "caltrop")
    3-Complete starts with: If the item starts with the given value (ex. "Cal" would match "Caltrop" or "Callie")
    4-Word starts with: If the item has multiple words, then if one of those words starts with the given value (ex. "Princp" would match "The Fluffy Princpality")
    5-Case starts with: If the item has a defined case (camelCase, PascalCase, snake_case or kebab-case), then if one of the parts starts with the given value (ex. "princpality" would match thefluffyprincpality or The_Fluffy_Princpality)
    6-Case acronym: If the item's case matches the synonym (ex. tfp would match "the-fluffy-princpality" or "TheFluffyPrincpality")
    7-Contains: If the item contains the given value (ex. "trop" would match "Caltrop")
    8-Acronym: If the item's acronym is the given value (ex. "tfp" would match "The Fluffy Princpality")
    9-Simple Match: If the item has letters in the same order as the letters of the given value. Furthermore, if the item is a closer match, it will rank higher (ex. "Cal" matches "Caltrop" more closely than "Clod", therefore "Caltrop" will be ordered before "Clod")

No args: If no arguments are provided we obviously can't go through the above layers, therefore it will just default to the user executing the command. NOTE: this won't happen if any arguements are provided.
Additional Parameters:
    "--r" => selects a random user
*/
client.getMemberFromArg = function(receivedMessage, arguments, pos, join, nomention) {
    var itteration = 0
    var fromString = null
    var allUserNames = [];
    var MainGuild = client.guilds.get("562324876330008576")
    MainGuild.members.forEach(m => {
        allUserNames.push(m.user.username)
        allUserNames.push(m.displayName)
    })
    if(!pos) pos = 0
    if(arguments) {
        if(pos !== "all") {
            fromString = arguments[pos]
            if(join) fromString = arguments.join(" ")
            if(!nomention) var member = receivedMessage.guild.member(receivedMessage.mentions.users.first())
            if(!member && fromString) member = receivedMessage.guild.members.get(fromString)
    
            if(fromString == "--r") {
                receivedMessage.guild.fetchMembers()
                var member = receivedMessage.guild.members.random()
            }
    
            if(!member && fromString) { //using find function on username, nickname, username + tag
                var Matches = matchSorter(allUserNames, fromString)
                var member = receivedMessage.guild.member(receivedMessage.guild.members.find(member => member.user.username.toLowerCase() == fromString.toLowerCase())||receivedMessage.guild.members.find(member => member.displayName.toLowerCase() == fromString.toLowerCase())||receivedMessage.guild.members.find(member => `${member.user.username.toLowerCase()}#${member.user.discriminator}`.toLowerCase() == fromString.toLowerCase()))
                if(Matches[0] && !member) {
                    console.log(console.color.cyan(`[Command Handler]`), `Matched ${Matches[0]} (${Matches.length - 1} other matches)`)
                    var member = receivedMessage.guild.member(receivedMessage.guild.members.find(member => member.user.username.toLowerCase() == Matches[0].toLowerCase())||receivedMessage.guild.members.find(member => member.displayName.toLowerCase() == Matches[0].toLowerCase()))
                }
            }

            if(!member && !fromString) { // if no results, use the person doing the command
                var member = receivedMessage.member
            }
            return member

        } else {
            while(true) {
                if(arguments[itteration]) {
                    console.log(console.color.cyan(`[Command Handler]`), `Trying for arguments[${itteration}]`)
                    fromString = arguments[itteration]
                    var member = receivedMessage.guild.member(receivedMessage.mentions.users.first()||receivedMessage.guild.members.get(fromString)) //mention or id
        
                    if(fromString == "--r") {
                        receivedMessage.guild.fetchMembers()
                        var member = receivedMessage.guild.members.random()
                    }
            
                    if(!member && fromString) { //using find function on username, nickname, username + tag
                        var Matches = matchSorter(allUserNames, fromString)
                        var member = receivedMessage.guild.member(receivedMessage.guild.members.find(member => member.user.username.toLowerCase() == fromString.toLowerCase())||receivedMessage.guild.members.find(member => member.displayName.toLowerCase() == fromString.toLowerCase())||receivedMessage.guild.members.find(member => `${member.user.username.toLowerCase()}#${member.user.discriminator}`.toLowerCase() == fromString.toLowerCase()))
                        if(Matches[0] && !member) {
                            console.log(console.color.cyan(`[Command Handler]`), `Matched ${Matches[0]} (${Matches.length - 1} other matches)`)
                            var member = receivedMessage.guild.member(receivedMessage.guild.members.find(member => member.user.username.toLowerCase() == Matches[0].toLowerCase())||receivedMessage.guild.members.find(member => member.displayName.toLowerCase() == Matches[0].toLowerCase()))
                        }
                    }
                    if(!member && !fromString) { // if no results, use the person doing the command
                        var member = receivedMessage.member
                    }
                    if(member) return member
                    console.log(console.color.cyan(`[Command Handler]`), `No success on arguments[${itteration}]`)
                    itteration++
                } else itteration++
                if(itteration >= 2000) {
                    var member = receivedMessage.member
                    return member
                }
            }
        }
        
    }
}
client.getChannelFromArg = function(receivedMessage, arguments, pos) {
    var allChannelNames = [];
    client.channels.forEach(channel => {
        if(channel.type == "text") {
            allChannelNames.push(channel.name)
        }
    });
    var fromString = null
    if(!pos) pos = 0
    if(arguments) {
        if(pos !== "all") {
            fromString = arguments[pos]

            var channel = receivedMessage.mentions.channels.first()
            if(!channel) var channel = client.channels.get(fromString)
    
            if(fromString == "--r") {
                var channel = client.channels.random()
            }
    
            if(!channel && fromString) {
                var Matches = matchSorter(allChannelNames, fromString)
                var channel = client.channels.find(channel => channel.name.toLowerCase() == fromString.toLowerCase())
                if(Matches[0] && !channel) {
                    console.log(console.color.cyan(`[Command Handler]`), `Matched ${Matches[0]} (${Matches.length - 1} other matches)`)
                    var channel = client.channels.find(channel => channel.name.toLowerCase() == Matches[0].toLowerCase())
                }
            }

            if(!channel && !fromString) {
                var channel = receivedMessage.channel
            }
            return channel

        }
    }
}
client.getRoleFromArg = function(receivedMessage, arguments, pos) {
    var allRoleNames = [];
    receivedMessage.guild.roles.forEach(role => {
        allRoleNames.push(role.name)
    });
    var fromString = null
    if(!pos) pos = 0
    if(arguments) {
        if(pos !== "all") {
            fromString = arguments[pos]

            var role = receivedMessage.mentions.roles.first()
            if(!role) var role = receivedMessage.guild.roles.get(fromString)
    
            if(fromString == "--r") {
                var role = receivedMessage.guild.roles.random()
            }
    
            if(!role && fromString) {
                var Matches = matchSorter(allRoleNames, fromString)
                var role = receivedMessage.guild.roles.find(role => role.name.toLowerCase() == fromString.toLowerCase())
                if(Matches[0] && !role) {
                    console.log(console.color.cyan(`[Command Handler]`), `Matched ${Matches[0]} (${Matches.length - 1} other matches)`)
                    var role = receivedMessage.guild.roles.find(role => role.name.toLowerCase() == Matches[0].toLowerCase())
                }
            }
            return role

        }
    }
}


client.on('message', (receivedMessage) => {
    if (receivedMessage.author.bot) return;
    
    if (receivedMessage.content.startsWith(client.user.toString())) {
        receivedMessage.channel.send("My command prefix is `" + client.cfg.prefix + "`.")
    }
    //if(receivedMessage.content.match(/\*[a-zA-Z ]+(the)?(<@559411424590299149>|bot|fluffyboi)([a-zA-Z ]+)?\*/gi)) return receivedMessage.channel.send("ᵃ⁻ᵃʰ")
    
    if (receivedMessage.content.startsWith(client.cfg.prefix)) {
        let cleaned = receivedMessage.content
        processCommand(receivedMessage, cleaned)
    }

    if(receivedMessage.content.startsWith("-" + client.cfg.prefix)) {
        let cleaned = receivedMessage.content.slice(1)
        receivedMessage.delete(100)
        processCommand(receivedMessage, cleaned)
    }

});

async function processCommand(receivedMessage, cleaned) {
    var start = new Date()
    var hrstart = process.hrtime()
    

    let fullCommand = cleaned.substr(client.cfg.prefix.length).trim() 
    let splitCommand = fullCommand.split(/ +/g) 
    let primaryCommand = splitCommand[0].toLowerCase() 
    let arguments = splitCommand.slice(1)

    arguments.map(a => a.trim())

    if(primaryCommand.match(/^(?![a-zA-Z]).*/gi)) return
    
    var cmdTableObj = {Command: `${client.cfg.prefix}${primaryCommand}`, Arguments: receivedMessage.cleanContent.slice(client.cfg.prefix.length + primaryCommand.length + 1), User: receivedMessage.author.tag}
    

    var command = client.commands.get(primaryCommand)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(primaryCommand));

    /*var reg = fullCommand.match(new RegExp("\n", "g"));
    if(reg !== null) {var newlinesAmt = reg.length.toString()}
    if(reg == null) {var newlinesAmt = 0}

    if (newlinesAmt > 5) {
        receivedMessage.delete(5000)
        receivedMessage.react("⛔")
        cmdTableObj.Failed = `Too many newlines`
        console.table(cmdTableObj)
        return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("Too many new Lines").setDescription(`You may not use more than 5 New Lines in your Command`).setColor(embedReder)).then(errormessage => {errormessage.delete(5000)})
    }*/

    if (!command) {

        
        var similarCommandsArray = [];

        await client.commands.forEach(cmd => {
            if(similarity(primaryCommand, cmd.name) >= 0.60) {
                var command = {cmd: cmd, similarity: similarity(primaryCommand, cmd.name), name: cmd.name}
                similarCommandsArray.push(command)
            }
            else cmd.aliases.forEach(alias => {
                if(similarity(primaryCommand, alias) >= 0.60) {
                    var command = {cmd: cmd, similarity: similarity(primaryCommand, alias), name: alias}
                    similarCommandsArray.push(command)
                }
            })
        })
            
        similarCommands = similarCommandsArray.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })
        await similarCommands.sort((a,b) => a.similarity - b.similarity)
        await similarCommands.reverse()

        if(similarCommands.length > 0) {
            command = similarCommands[0].cmd

            cmdTableObj.CorrectedTo = command.name

            var similarityNum = similarCommands[0].similarity * 100
            similarityNum = +similarityNum.toFixed(parseInt(1));

            var misspelEmbed = new Discord.RichEmbed()
            .setAuthor(`Misspelled Command`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
            .setDescription(`\`${primaryCommand}\` is not a valid Command. I have detected a \`${similarityNum}%\` similarity with the \`${similarCommands[0].cmd.name}\` command and have executed that instead.`)
            .setColor(embedRed)
            .setFooter(`If you think this was done by mistake, please contact Caltrop#0001.`)

            receivedMessage.channel.send({embed: misspelEmbed})
        } else {
            receivedMessage.delete(5000)
            receivedMessage.react("⛔")
            cmdTableObj.Failed = `Invalid / Unknown Command`
            console.table(cmdTableObj)
            return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("Unknown Command").setDescription(`\`${primaryCommand}\` is not a known or valid Command. Try doing \`${client.cfg.prefix}help\` for a full list of valid commands.`).setColor(embedReder)).then(errormessage => {errormessage.delete(5000)})
        }
    }

    if (command.Enabled == false) {
        receivedMessage.delete(5000)
        receivedMessage.react("⛔")
        cmdTableObj.Failed = `Command is disabled`
        console.table(cmdTableObj)
        return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("Command Disabled").setDescription(`\`${command.name}\` is currently disabled, please contact the Moderators if you think this was done by mistake.`).setColor(embedReder)).then(errormessage => {errormessage.delete(5000)})
    }

    if (command.args && !arguments.length) {
        receivedMessage.delete(5000)
        receivedMessage.react("⛔")
        cmdTableObj.Failed = `No arguments provided`
        console.table(cmdTableObj)
        return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("You didn't provide any arguments").setDescription(`The proper usage would be: \`${client.cfg.prefix}${command.name} ${command.usage}\``).setColor(embedReder)).then(errormessage => {errormessage.delete(5000)})
    }

    if (command.guildOnly && receivedMessage.channel.type !== 'text') {
        receivedMessage.react("⛔")
        cmdTableObj.Failed = `Guild only`
        console.table(cmdTableObj)
        return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("Invalid Guild").setDescription(`\`${command.name}\` is disabled in DMs.`).setColor(embedReder))
    }
    
    if(command.permLevel !== 0) {
        var perm = client.cmd.permissions.find(perm => {
            return perm.position == command.permLevel
        })
        if(!perm) return receivedMessage.reply(`Failed to verify if you have the correct permissions to use this Command. Please message **Caltrop#0001** if this error persists.`)
        if(perm.perm !== "") {
            if(!receivedMessage.member.hasPermission(perm.perm)) {
                receivedMessage.delete(5000)
                receivedMessage.react("⛔")
                cmdTableObj.Failed = `Below permission level ${perm.position} (${perm.name})`
                console.table(cmdTableObj)
                return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle(`Below required Permission Level`).setDescription(`You need to be have the \`${perm.name}\` permission to use the \`${command.name}\` command.`).setColor(embedReder)).then(errormessage => {errormessage.delete(5000)})
            }
        } else if(perm.position == 5 && receivedMessage.member.id.toString() !== client.cfg.ownerID) {
            receivedMessage.delete(5000)
            receivedMessage.react("⛔")
            cmdTableObj.Failed = `Below permission level ${perm.position} (${perm.name})`
            console.table(cmdTableObj)
            return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle(`Below required Permission Level`).setDescription(`You need to be **Caltrop#0001** to use the \`${command.name}\` command.`).setColor(embedReder)).then(errormessage => {errormessage.delete(5000)})
        } else if(perm.position == 4 && receivedMessage.member.id.toString() !== receivedMessage.guild.owner.id.toString()) {
            receivedMessage.delete(5000)
            receivedMessage.react("⛔")
            cmdTableObj.Failed = `Below permission level ${perm.position} (${perm.name})`
            console.table(cmdTableObj)
            return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle(`Below required Permission Level`).setDescription(`You need to be the Guild Owner to use the \`${command.name}\` command.`).setColor(embedReder)).then(errormessage => {errormessage.delete(5000)})
        }
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = command.rateLimit.duration * 1000

    var cmdDuration = receivedMessage.channel.id == "562328185728008204" ? cooldownAmount / 2 : cooldownAmount * 1.5

    if(timestamps.size >= command.rateLimit.maxUsers) {
        receivedMessage.delete(5000)
        receivedMessage.react("⛔")
        cmdTableObj.Failed = `Too many users using command`
        console.table(cmdTableObj)
        return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("Rate Limited").setDescription(`Woah, slow down there Cowboy! The \`${command.name}\` command is limited to \`${command.rateLimit.maxUsers}\` Users per ${(cmdDuration / 1000).toFixed(1)} second(s).`).setColor(embedReder)).then(errormessage => {errormessage.delete(5000)});
    }
    
    var collectionUser = timestamps.get(receivedMessage.author.id)
    if (collectionUser) {
        
        const expirationTime = collectionUser.start + cmdDuration;
        const startTime = collectionUser.start
        var usages = collectionUser.uses + 1
        timestamps.set(receivedMessage.author.id, {start: startTime, uses: usages});

        if (now < expirationTime && usages > command.rateLimit.usages) {
            const timeLeft = (expirationTime - now) / 1000;
            receivedMessage.delete(5000)
            receivedMessage.react("⛔")
            cmdTableObj.Failed = `Reached Rate limit`
            console.table(cmdTableObj)
            return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor("Command Rejected:").setTitle("Rate Limited").setDescription(`Woah, slow down there Cowboy! You may only use the \`${command.name}\` command \`${command.rateLimit.usages}\` times every ${(cmdDuration / 1000).toFixed(1)} second(s), **please wait ${timeLeft.toFixed(1)} more second(s) before reusing it**`).setColor(embedReder)).then(errormessage => {errormessage.delete(5000)});
        }
    } else {
        timestamps.set(receivedMessage.author.id, {start: now, uses: 1});
        setTimeout(() => timestamps.delete(receivedMessage.author.id), cmdDuration);
    }

    try {
        command.execute(client, arguments, receivedMessage, primaryCommand);
    } catch (error) {
        var errorType = error.constructor.name == `Error` ? `Unknown` : error.constructor.name
        receivedMessage.channel.send(new Discord.RichEmbed().setAuthor(":(").setDescription(`oh oh, you weren't supposed to see this message, if this Error persists, please message **Caltrop#0001**`).addField("Error:", "`" + error.message.substring(0,120)  + "...`" + `\n\nType: \`${errorType}\`\nModule: \`${error.fileName}\`\nLine: \`${error.lineNumber}\``).setColor(embedReder))
    }


    connection.query(`SELECT * FROM cmdanal WHERE cmdname = '${command.name}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length < 1) {
            sql = `INSERT INTO cmdanal (cmdname, uses) VALUES ('${command.name}', ${1})`
        } else {
            let uses = rows[0].uses;
            sql = `UPDATE cmdanal SET uses = ${uses + 1} WHERE cmdname = '${command.name}'`
        }
        connection.query(sql)
    })

    hrend = process.hrtime(hrstart)

    cmdTableObj.ExecutionTime = `${hrend[0]}s, ${hrend[1] / 1000000}ms`
    console.table(cmdTableObj)
}



function mutecooldownCheck() {
    connection.query(`SELECT * FROM mute`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length < 1) {
            return
        } else {
            rows.forEach(async row => {
                if (Date.now() > row.expiry  && client.status === Discord.Constants.Status.READY) {
                    let muteExpiredChannel = client.channels.find(channel => channel.name === "bot_logs");
                    
                    let muteExpiredGuild = client.guilds.get(row.guild);
                    let muteExpiredUser = await muteExpiredGuild.fetchMember(row.id).catch(err => console.log(console.color.green(`[MUTE]`), `The mute of ${row.id} has expired but the user has left the Guild`))
                    if(!muteExpiredUser) return
                    console.color.green(`[MUTE]`), `The mute of ${row.id} has expired!`

                    sql = `DELETE FROM mute WHERE id = '${row.id}';`        
        

                    if(row.channel !== null) {
                        var channel = client.channels.get(row.channel)
                        channel.overwritePermissions(muteExpiredUser, {
                            SEND_MESSAGES: null
                        }, `Automatic unmute`)
                    } else {
                        muteExpiredGuild.fetchMember(row.id).then(muteExpiredUser => {
                            muteExpiredUser.removeRole(muteExpiredUser.roles.find(role => role.name === "Muted"))
                        });
                    }
    
        
                    var muteExpiredEmbed = new Discord.RichEmbed()
                    .setColor(embedGreen)
                    .setAuthor("Event: #" )
                    .setTitle("User unmute")
                    .addField("Guild", muteExpiredGuild.name, false)
                    .addField("User", `<@${row.id}>`, false)
                    .addField("Orginal Mute applied by", "Moderator " + `<@${row.invokinguser}>`, false)
                    .addField("User unmuted by", "Automatically unmuted", false)
                    .addField("Duration", prettyMs(row.expiry - row.start, {verbose: true, compact: true}), false)
                    .addField("Applied on", new Date(row.start))
                    .setTimestamp()
        
                    muteExpiredChannel.send({embed: muteExpiredEmbed})
        
                    var DMmuteExpiredEmbed = new Discord.RichEmbed()
                    .setColor(embedGreen)
                    .setAuthor("You have been automatically unmuted")
                    .addField("Guild", muteExpiredGuild.name, false)
                    .addField("User (you)", `<@${row.id}>`, false)
                    .addField("Moderator", `<@${row.invokinguser}>`, false)
                    .addField("Duration", prettyMs(row.expiry - row.start, {verbose: true, compact: true}), false)
                    .addField("Applied on", new Date(row.start))
                    .setTimestamp()
        
                    muteExpiredGuild.fetchMember(row.id).then (muteExpiredUser => {
                        muteExpiredUser.send({embed: DMmuteExpiredEmbed})
                    });
        
                    connection.query(sql, console.log)
                    
                }
            })
        
        }
    })
}
setInterval(mutecooldownCheck, 100000)

function warncooldowncheck() {
    connection.query(`SELECT * FROM warn WHERE active = 1`, (err, rows) => {
        if(err) throw err;
        let sql;
        rows.forEach(async row => {
            if (Date.now() > row.expiry && client.status === Discord.Constants.Status.READY) {
                connection.query(`UPDATE warn SET randid = ${-Math.abs(row.randid)}, active = ${0} WHERE randid = ${row.randid} AND userid = '${row.userid}'`, console.log)

                let warnExpiredGuild = await client.guilds.get(row.guild);
                let warnExpiredUser = await warnExpiredGuild.fetchMember(row.userid);

                var invokingMember = await warnExpiredGuild.members.get(row.invokinguser)

                var expiredembed = new Discord.RichEmbed()
                .setAuthor(`Your Warn level has gone down`)
                .setDescription("A warning has expired, your warn Level has gone down to " + parseInt(row.warnid) - 1)
                .addField("Warn Reason", row.reason.toString())
                .addField("Warn ID", row.randid)
                .addField("Warn Level of the Warn", row.warnid)
                .addField("Moderator", invokingMember)
                .setColor(embedGreen)
                .setTimestamp()

                warnExpiredUser.send({embed: expiredembed})
            }
        })
    })

}
setInterval(warncooldowncheck, 100000)

function reminderCheck() {
    connection.query(`SELECT * FROM remindme`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length < 1) {
            return
        } else {
            rows.forEach(row => {
                if (Date.now() > row.expiry  && client.status === Discord.Constants.Status.READY) {
                    sql = `DELETE FROM remindme WHERE ID = '${row.ID}';`
        
                    var reminderChannel = client.channels.get(row.channelid);
                    var user = client.users.get(row.userid);

                    var reminderEmbed = new Discord.RichEmbed()
                    .setAuthor(`Reminder!`, user.displayAvatarURL, user.displayAvatarURL)
                    .setColor(0x4AD931)
                    .setTimestamp()
                    .setDescription(`You asked me \`${prettyMs(Date.now() - row.start, {verbose: true, compact: true})}\` ago to remind you of the following.`)
                    .addField(`Reminder`, row.reminder)

                    user.send(user, {embed: reminderEmbed})
        
                    connection.query(sql, console.log)
                    
                }
            })
        
        }
    })
}
setInterval(reminderCheck, 100000)
client.login(config.token);

process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error(console.color.red(`[META]`), console.color.red(`[Uncaught Exception]`), errorMsg);

    console.color.red(`[META]`, `Shutting down...`);
    if(!config.maintenance) {
        logger.setLevel('fatal');
        logger.fatal(errorMsg);
    };
        setTimeout(() => {
            process.exit(1);
        }, 1000);
  });
  process.on("unhandledRejection", err => {
    console.log(console.color.red(`[META]`), console.color.red(`[Uncaught Promise Error]`), err.message);
  });