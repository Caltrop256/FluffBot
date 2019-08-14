// message
/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
receivedMessage        Message        The created message    */
const Discord = require('discord.js');
const config = require("../commands/json/config.json");
const prettyMs = require('pretty-ms');
const smartTruncate = require('smart-truncate');
var similarity = require("similarity");
var Chance = require('chance');
var chance = new Chance();
var mysql = require('mysql');
if(config.maintenance == false) {
    var connection = mysql.createConnection({
        host     : `localhost`,
        port     : `3306`,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}else {
    var connection = mysql.createConnection({
        host     : config.mySQLHost,
        port     : config.mySQLPort,
        user     : config.mySQLuser,
        password : config.mySQLPassword,
        database : config.mySQLdb
    });
}

module.exports = (client, receivedMessage) => {
    client.lastSeen(receivedMessage.member, `Sent a message in #${receivedMessage.channel.name}`)

    var noMarkDown = receivedMessage.content.toLowerCase().replace(/(?![a-zA-Z])./gi, "")
    if(noMarkDown == "k") return receivedMessage.delete(1);

    if(client.cfg.spamFilter == "true") {
        var messageInformation = messageSpamCheck(receivedMessage)


        async function messageSpamCheck(receivedMessage) {
            var spamChannel = client.spam.lmsgChannel
            var spamUser = client.spam.lmsgUser
            var curChannel = receivedMessage.channel
            var curUser = receivedMessage.member

            if(curUser !== null) {
                if(!spamUser[curUser.id]) {
                    spamUser[curUser.id] = [];
                }
                var channelMessageArray = spamChannel[curChannel.id]
                var userMessageArray = spamUser[curUser.id]
                
                var userMessageArrayshortened = userMessageArray

                userMessageArrayshortened.length = 3
        
                channelMessageArray.unshift(receivedMessage)
                userMessageArray.unshift(receivedMessage)
        
                if(channelMessageArray.length >= 30) channelMessageArray.length = 30
                if(userMessageArray.length >= 10) userMessageArray.length = 10
        
                var cmsgCombinedString = ''
                var umsgCombinedString = ''
                
                var shortenedcmsgCombinedString = ''
        
                channelMessageArray.forEach(m => {
                    cmsgCombinedString = cmsgCombinedString + ` ${m.content}`
                })

                var usertimestampArray = []
                var usertimestampArrayB = []
                userMessageArray.forEach(m => {
                    umsgCombinedString = umsgCombinedString + ` ${m.content}`
                    usertimestampArray.push(m.createdTimestamp)
                    usertimestampArrayB.push(m.createdTimestamp)
                })
                usertimestampArrayB.shift()
                var usertimestampArrayReduced = []

                for(var i = 0;i<=usertimestampArrayB.length-1;i++) {
                usertimestampArrayReduced.push(usertimestampArray[i] - usertimestampArrayB[i]);
                }

                const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        
                var userAverageDelay = average(usertimestampArrayReduced);
                if(isNaN(userAverageDelay)) userAverageDelay = 1000

                var SigmoidUserAvgDelay = 1 / (1 + Math.exp((userAverageDelay / 1000)))

                userMessageArrayshortened.forEach(m => {
                    shortenedcmsgCombinedString = shortenedcmsgCombinedString + `${m.content.replace(/[^a-zA-Z]/g, "")}`
                })
                var uStringCapitalPercent = (shortenedcmsgCombinedString.length - shortenedcmsgCombinedString.replace(/[^a-z]/g, "").length) / shortenedcmsgCombinedString.length * 100
                if(isNaN(uStringCapitalPercent)) uStringCapitalPercent = 0

                var repeatedLetterCheck = receivedMessage.content.toString().match(new RegExp(/(.)\1{9,}/ig));
                if(repeatedLetterCheck !== null) {var repeatedLetters = repeatedLetterCheck[0].toString().length / receivedMessage.content.length * 100}
                if(repeatedLetterCheck == null) {var repeatedLetters = 0}

                var repeatedWordsCaptureGroupAmt = 0
                var repeatedWordsTotal = 0

                var repeatedWordsCheck = receivedMessage.content.toString().replace(/[^a-zA-Z ]/, "").match(new RegExp(/\b(\w+)(?:\s+\1\b)+/gim));
                if(repeatedWordsCheck) {
                    repeatedWordsCheck.forEach(capture => {
                        repeatedWordsCaptureGroupAmt++
                        var repeatedAmountArray = capture.split(" ")
                        repeatedWordsTotal = repeatedWordsTotal + repeatedAmountArray.length
                    })
                }
                var wordsInMessage = receivedMessage.content.split(" ")
                var repeatedWordsPercent = repeatedWordsTotal / wordsInMessage.length * 100
                
                var SimilarToMessagesAmt = 0
                channelMessageArray.forEach(m => {
                    if(similarity(receivedMessage.content.toLowerCase(), m.content.toLowerCase()) >= 0.90 && receivedMessage.id !== m.id) {
                        SimilarToMessagesAmt++
                    }
                })
                var similarToMessagesPercent = SimilarToMessagesAmt / channelMessageArray.length * 100

                var PastLinks = 0
                var linkmatcher = umsgCombinedString.toString().match(new RegExp(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/ig));
                if(linkmatcher) PastLinks = linkmatcher.length

                var HasIllegalInvite = false
                var DiscordInviteCheck = receivedMessage.content.toString().match(new RegExp(/discord\.gg\/(invite\/)?[a-zA-Z0-9]+$/gim)) || receivedMessage.content.match(/discordapp\.com\/(invite\/)[a-zA-Z0-9]+$/gim);
                if(DiscordInviteCheck) {
                    for(var i = 0;i<=DiscordInviteCheck.length-1;i++) {
                        await client.fetchInvite(DiscordInviteCheck[i]).then(invite => {
                            if(invite.guild.id !== 562324876330008576) {
                                HasIllegalInvite = true
                            }
                        })
                    }
                }


                messageInformation = {
                    caps: uStringCapitalPercent,
                    letterRepeats: repeatedLetters,
                    wordRepeatCaptures: repeatedWordsCaptureGroupAmt,
                    wordRepeats: repeatedWordsPercent,
                    SimilarMessages: similarToMessagesPercent,
                    SigmoidUser: SigmoidUserAvgDelay,
                    UserAvgDelay: userAverageDelay.toFixed(),
                    Links: PastLinks,
                    HasInvites: HasIllegalInvite,
                }
                return messageInformation


            }
            
            
        }

        const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        var PercentageValArray = [
            messageInformation.caps,
            messageInformation.letterRepeats,
            messageInformation.wordRepeats,
            messageInformation.SimilarMessages
        ]
        var OtherValArray = [
            messageInformation.wordRepeatCaptures,
            messageInformation.Links,
            messageInformation.SigmoidUser
        ]    
        var Cleanliness = average(OtherValArray) * (average(PercentageValArray))
        if(Cleanliness >= 10) {
            if(!client.spam.user[receivedMessage.author.id]) {
                client.spam.user[receivedMessage.author.id] = 0
            };
            client.spam.user[receivedMessage.author.id]++
            console.log(`${receivedMessage.member.displayName} has spammed ${client.spam.user[receivedMessage.author.id]} time(s)`)
            receivedMessage.delete(100)
            return receivedMessage.channel.send(new Discord.RichEmbed().setAuthor(`Yo ${receivedMessage.member.displayName}`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL).setTitle("your message has been deleted!").setDescription(`Your message has been deleted as I have detected it to have a Spam Value of \`${Math.floor(Cleanliness)}\`.`).setFooter("Please notify Caltrop#0001 if this action was incorrect").setColor(0xFC4B4B)).then(errormessage => {errormessage.delete(5000)})
        }   
    }

    if(!receivedMessage.author.bot) {
        
        let giveNumber = Math.floor(Math.random() * 15) + 15;
        let baseAMT = Math.floor(Math.random() * 15) + 15;

        if(giveNumber === baseAMT) {
            const embeds = receivedMessage.embeds;
            const attachments = receivedMessage.attachments; 
            let eURL = ''
            if (embeds.length > 0) {
            if(embeds[0].thumbnail && embeds[0].thumbnail.url)
                eURL = embeds[0].thumbnail.url;
            else if(embeds[0].image && embeds[0].image.url)
                eURL = embeds[0].image.url;
            else
                eURL = embeds[0].url;
            } else if (attachments.array().length > 0) {
            const attARR = attachments.array();
            eURL = attARR[0].url;
            }

            var im = eURL ? 1 : 0

            var coinNum = Math.floor((giveNumber / 2) * (receivedMessage.cleanContent.length * 0.1 + im)) < 1 ? 1 : Math.floor((giveNumber / 2) * (receivedMessage.cleanContent.length * 0.1 + im))
            console.log(console.color.green(`[Economy]`),`Gave ${receivedMessage.author.username} ${coinNum}${client.cfg.curName}`)

            connection.query(`SELECT * FROM coins WHERE id = '${receivedMessage.author.id}'`, (err, rows) => {
                if(err) throw err;
                let sql;
                if(rows.length < 1) {
                    sql = `INSERT INTO coins (id, coins) VALUES ('${receivedMessage.author.id}', ${coinNum})`
                } else {
                    let coins = rows[0].coins;
                    client.addEntry(receivedMessage.author.id, coins + coinNum, 111);
                    sql = `UPDATE coins SET coins = ${coins + coinNum} WHERE id = '${receivedMessage.author.id}'`
                }
                connection.query(sql)
            })
        }
    }
    if(receivedMessage.guild == null || receivedMessage.guild == undefined) {
        if(receivedMessage.author.bot) {return}
                        const embeds = receivedMessage.embeds;
                        const attachments = receivedMessage.attachments; 
    
                        let eURL = ''
    
                        if (embeds.length > 0) {
    
                        if(embeds[0].thumbnail && embeds[0].thumbnail.url)
                            eURL = embeds[0].thumbnail.url;
                        else if(embeds[0].image && embeds[0].image.url)
                            eURL = embeds[0].image.url;
                        else
                            eURL = embeds[0].url;
    
                        } else if (attachments.array().length > 0) {
                        const attARR = attachments.array();
                        eURL = attARR[0].url;
                        }
        var DMUser = client.users.get("214298654863917059")
        var DMEmbed = new Discord.RichEmbed()
        .setAuthor(`DM from ${receivedMessage.author.username}`, receivedMessage.author.avatarURL, receivedMessage.author.avatarURL)
        .setDescription(`You have received a direct Message from ${receivedMessage.author.username}#${receivedMessage.author.discriminator}`)
        .setThumbnail(receivedMessage.author.avatarURL)
        .setImage(eURL)
        if(receivedMessage.content.length > 0) {DMEmbed.addField("Message contents", smartTruncate(receivedMessage.content, 1000))}
        else{DMEmbed.addField("Message contents", "`Empty Message`")}
        DMEmbed.addField("User Info", `Name: \`${receivedMessage.author.username}#${receivedMessage.author.discriminator}\`\nID: \`${receivedMessage.author.id}\`\nAccount Age: \`${prettyMs(new Date() - receivedMessage.author.createdTimestamp, {verbose: true, compact: true})}\`\nAttachment (if provided):`)
        DMEmbed.setTimestamp("")
        DMEmbed.setFooter("")
        if(receivedMessage.author.id !== DMUser.id) {DMUser.send({embed: DMEmbed})};
    }

    if(receivedMessage.guild !== null && receivedMessage.guild !== undefined) {
        if (receivedMessage.author.bot) return;
        if (receivedMessage.content.startsWith(client.cfg.prefix)) return;
        var message = receivedMessage.content
        var spaceless = receivedMessage.content.replace(/( )/g, '')
        if(spaceless.match(/^h{1,}$/gi)) {
            if(spaceless.length < 10) {
                receivedMessage.react("🗜") // reacc box
            }
            if(spaceless.length > 9) {
                receivedMessage.react(":calpression:561287462492831744")
            }
        }
        if(message.match(/(w(h(a{1,})t?)?)( )?t(h(e{1,}))?( )?f((u{1,})c[c|k])?/gi)) {receivedMessage.react(":ralsei_angry:562330227947339806")}
        if(message.match(/((mods?( )?(are|=)?( )?gay)|((gay)( )?mods?( )?(are|=)?))/gi)) {receivedMessage.reply("It is known.")}
        if(message.match(/milk/gi)) {receivedMessage.react("🥛")}
        if(message.match(/compress/gi)) {receivedMessage.react("🗜")}
        if(message.match(/egg/gi)) {receivedMessage.react("🥚")}
        if(message.match(/\bbr+([au]+)(h+)?(\b|$)/gi)) {receivedMessage.react("🗿")}
        //if(message.match(/\bpetition\b/gi) || message.match(/\bpoll\b/gi)) {receivedMessage.react(":Plus1:562330227834093569"); receivedMessage.react(":Minus1:562330227712458772")}
        //if(message.match(/((0rz\.tw)|(0rz\.tw)|(1-url\.net)|(1link\.in)|(1tk\.us)|(1un\.fr)|(1url\.com)|(1url\.cz)|(1wb2\.net)|(2\.gp)|(2\.ht)|(2ad\.in)|(2big\.at)|(2doc\.net)|(2fear\.com)|(2pl\.us)|(2tu\.us)|(2ty\.in)|(2u\.xf\.cz)|(2ya\.com)|(3\.ly)|(3ra\.be)|(3x\.si)|(4i\.ae)|(4ms\.me)|(4sq\.com)|(4url\.cc)|(4view\.me)|(5em\.cz)|(5url\.net)|(5z8\.info)|(6fr\.ru)|(6g6\.eu)|(6url\.com)|(7\.ly)|(7fth\.cc)|(7li\.in)|(7vd\.cn)|(8u\.cz)|(76\.gd)|(77\.ai)|(98\.to)|(126\.am)|(307\.to)|(944\.la)|(a\.gg)|(a\.nf)|(a0\.fr)|(a2a\.me)|(aa\.cx)|(abbr\.sk)|(abbrr\.com)|(abcurl\.net)|(ad-med\.cz)|(ad\.vu)|(ad5\.eu)|(ad7\.biz)|(adb\.ug)|(adcraft\.co)|(adcrun\.ch)|(adf\.ly)|(adfa\.st)|(adfly\.fr)|(adjix\.com)|(adli\.pw)|(adv\.li)|(afx\.cc)|(ajn\.me)|(aka\.gr)|(alil\.in)|(all\.fuseurl\.com)|(alturl\.com)|(amzn\.to)|(any\.gs)|(aqva\.pl)|(ar\.gy)|(ares\.tl)|(arst\.ch)|(asso\.in)|(atu\.ca)|(au\.ms)|(ayt\.fr)|(azali\.fr)|(azc\.cc)|(b00\.fr)|(b2l\.me)|(b23\.ru)|(b54\.in)|(bacn\.me)|(baid\.us)|(bc\.vc)|(bcool\.bz)|(bee4\.biz)|(bfy\.tw)|(bim\.im)|(binged\.it)|(bit\.do)|(bit\.ly)|(bitly\.com)|(bitw\.in)|(bizj\.us)|(bkite\.com)|(blap\.net)|(ble\.pl)|(blip\.tv)|(bloat\.me)|(boi\.re)|(bote\.me)|(bougn\.at)|(br4\.in)|(bravo\.ly)|(brk\.to)|(brzu\.net)|(bsa\.ly)|(budurl\.com)|(buk\.me)|(bul\.lu)|(burnurl\.com)|(buzurl\.com)|(bxl\.me)|(bzh\.me)|(c-o\.in)|(cachor\.ro)|(canurl\.com)|(captur\.in)|(catchylink\.com)|(cbs\.so)|(cbug\.cc)|(cc\.cc)|(ccj\.im)|(cf\.ly)|(cf2\.me)|(cf6\.co)|(chilp\.it)|(chzb\.gr)|(cjb\.net)|(cl\.lk)|(cl\.ly)|(clck\.ru)|(cli\.gs)|(cliccami\.info)|(clickmeter\.com)|(clickthru\.ca)|(clikk\.in)|(clop\.in)|(cn86\.org)|(conta\.cc)|(cort\.as)|(cot\.ag)|(couic\.fr)|(cr\.tl)|(crisco\.com)|(crks\.me)|(ctvr\.us)|(cudder\.it)|(cur\.lv)|(curl\.im)|(cut\.pe)|(cut\.sk)|(cutt\.eu)|(cutt\.us)|(cutu\.me)|(cuturl\.com)|(cybr\.fr)|(cyonix\.to)|(d75\.eu)|(daa\.pl)|(dai\.ly)|(db\.tt)|(dd\.ma)|(ddp\.net)|(decenturl\.com)|(dfl8\.me)|(dft\.ba)|(digbig\.com)|(digg\.com)|(disq\.us)|(dld\.bz)|(dlvr\.it)|(do\.my)|(doiop\.com)|(dolp\.cc)|(dopen\.us)|(dopice\.sk)|(droid\.ws)|(dv\.gd)|(dwarfurl\.com)|(dy\.fi)|(dyo\.gs)|(e37\.eu)|(easyuri\.com)|(easyurl\.com)|(easyurl\.net)|(ecra\.se)|(eepurl\.com)|(ely\.re)|(erax\.cz)|(erw\.cz)|(esyurl\.com)|(eweri\.com)|(ewerl\.com)|(ex9\.co)|(ezurl\.cc)|(fa\.b)|(fa\.by)|(fav\.me)|(fb\.me)|(fbshare\.me)|(ff\.im)|(fff\.re)|(fff\.to)|(fff\.wf)|(fhurl\.com)|(filoops\.info)|(filz\.fr)|(fire\.to)|(firsturl\.de)|(firsturl\.net)|(flic\.kr)|(flq\.us)|(fly2\.ws)|(fnk\.es)|(foe\.hn)|(folu\.me)|(fon\.gs)|(freak\.to)|(freze\.it)|(fur\.ly)|(fuseurl\.com)|(fuzzy\.to)|(fwd4\.me)|(fwib\.net)|(g\.ro\.lt)|(g00\.me)|(gg\.gg)|(gizmo\.do)|(gl\.am)|(go\.9nl\.com)|(go\.ign\.com)|(go\.usa\.gov)|(go2\.me)|(go2cut\.com)|(goo\.gl)|(goo\.lu)|(goshrink\.com)|(gowat\.ch)|(grem\.io)|(gri\.ms)|(guiama\.is)|(gurl\.es)|(hadej\.co)|(hellotxt\.com)|(hex\.io)|(hide\.my)|(hiderefer\.com)|(hjkl\.fr)|(hmm\.ph)|(hops\.me)|(hover\.com)|(href\.in)|(href\.li)|(hsblinks\.com)|(ht\.ly)|(htxt\.it)|(huff\.to)|(hugeurl\.com)|(hurl\.it)|(hurl\.me)|(hurl\.ws)|(i-2\.co)|(i99\.cz)|(icanhaz\.com)|(icit\.fr)|(ick\.li)|(icks\.ro)|(idek\.net)|(iguang\.tw)|(iiiii\.in)|(iky\.fr)|(ilix\.in)|(info\.ms)|(inreply\.to)|(is\.gd)|(iscool\.net)|(isra\.li)|(iterasi\.net)|(itm\.im)|(its\.my)|(ity\.im)|(ix\.lt)|(ix\.sk)|(j\.gs)|(j\.mp)|(jdem\.cz)|(jieb\.be)|(jijr\.com)|(jmp2\.net)|(jp22\.net)|(jqw\.de)|(just\.as)|(kask\.us)|(kd2\.org)|(kfd\.pl)|(kissa\.be)|(kl\.am)|(klck\.me)|(korta\.nu)|(kr3w\.de)|(krat\.si)|(kratsi\.cz)|(krod\.cz)|(krunchd\.com)|(kuc\.cz)|(kxb\.me)|(l-k\.be)|(l\.gg)|(l9\.fr)|(l9k\.net)|(lat\.ms)|(lc-s\.co)|(lc\.cx)|(lcut\.in)|(lemde\.fr)|(libero\.it)|(lick\.my)|(lien\.li)|(lien\.pl)|(liip\.to)|(liltext\.com)|(lin\.cr)|(lin\.io)|(linkbee\.com)|(linkbun\.ch)|(linkn\.co)|(liurl\.cn)|(llu\.ch)|(ln-s\.net)|(ln-s\.ru)|(lnk\.co)|(lnk\.gd)|(lnk\.in)|(lnk\.ly)|(lnk\.ms)|(lnk\.sk)|(lnkd\.in)|(lnks\.fr)|(lnkurl\.com)|(lnky\.fr)|(lnp\.sn)|(loopt\.us)|(lp25\.fr)|(lru\.jp)|(lt\.tl)|(lurl\.no)|(lvvk\.com)|(m1p\.fr)|(m3mi\.com)|(macte\.ch)|(make\.my)|(mash\.to)|(mcaf\.ee)|(mdl29\.net)|(merky\.de)|(metamark\.net)|(mic\.fr)|(migre\.me)|(minilien\.com)|(miniurl\.com)|(minu\.me)|(minurl\.fr)|(mke\.me)|(moby\.to)|(moourl\.com)|(more\.sh)|(mrte\.ch)|(mut\.lu)|(myloc\.me)|(myurl\.in)|(n\.pr)|(nbc\.co)|(nblo\.gs)|(ne1\.net)|(net\.ms)|(net46\.net)|(nicou\.ch)|(nig\.gr)|(njx\.me)|(nn\.nf)|(not\.my)|(notlong\.com)|(nov\.io)|(nq\.st)|(nsfw\.in)|(nutshellurl\.com)|(nxy\.in)|(nyti\.ms)|(o-x\.fr)|(oc1\.us)|(okok\.fr)|(om\.ly)|(omf\.gd)|(omoikane\.net)|(on\.cnn\.com)|(on\.mktw\.net)|(onforb\.es)|(orz\.se)|(ou\.af)|(ou\.gd)|(oua\.be)|(ow\.ly)|(p\.pw)|(para\.pt)|(parky\.tv)|(past\.is)|(pd\.am)|(pdh\.co)|(ph\.ly)|(pic\.gd)|(pic\.gd)|(tweetphoto)|(pich\.in)|(pin\.st)|(ping\.fm)|(piurl\.com)|(pli\.gs)|(plots\.fr)|(pm\.wu\.cz)|(pnt\.me)|(po\.st)|(politi\.co)|(poprl\.com)|(post\.ly)|(posted\.at)|(pp\.gg)|(ppfr\.it)|(ppst\.me)|(ppt\.cc)|(ppt\.li)|(prejit\.cz)|(prettylinkpro\.com)|(profile\.to)|(ptab\.it)|(ptiturl\.com)|(ptm\.ro)|(pub\.vitrue\.com)|(pw2\.ro)|(py6\.ru)|(q\.gs)|(qbn\.ru)|(qicute\.com)|(qlnk\.net)|(qqc\.co)|(qqurl\.com)|(qr\.ae)|(qr\.net)|(qrtag\.fr)|(qte\.me)|(qu\.tc)|(quip-art\.com)|(qxp\.cz)|(qxp\.sk)|(qy\.fi)|(r\.im)|(rb6\.co)|(rb6\.me)|(rcknr\.io)|(rdz\.me)|(read\.bi)|(readthis\.ca)|(reallytinyurl\.com)|(redir\.ec)|(redir\.fr)|(redirects\.ca)|(redirx\.com)|(redu\.it)|(ref\.so)|(reise\.lc)|(relink\.fr)|(retwt\.me)|(ri\.ms)|(rickroll\.it)|(riz\.cz)|(riz\.gd)|(rod\.gs)|(roflc\.at)|(rsmonkey\.com)|(rt\.nu)|(rt\.se)|(ru\.ly)|(rubyurl\.com)|(rurl\.org)|(rww\.tw)|(s-url\.fr)|(s4c\.in)|(s7y\.us)|(s7y\.us)|(shrinkify)|(safe\.mn)|(sagyap\.tk)|(sameurl\.com)|(scrnch\.me)|(sdu\.sk)|(sdut\.us)|(seeme\.at)|(segue\.se)|(sh\.st)|(shar\.as)|(shar\.es)|(sharein\.com)|(sharetabs\.com)|(shink\.de)|(shorl\.com)|(short\.cc)|(short\.ie)|(short\.nr)|(short\.pk)|(short\.to)|(shortlinks\.co\.uk)|(shortna\.me)|(shorturl\.com)|(shoturl\.us)|(shout\.to)|(show\.my)|(shrinkify\.com)|(shrinkr\.com)|(shrinkster\.com)|(shrt\.fr)|(shrt\.in)|(shrt\.st)|(shrten\.com)|(shrunkin\.com)|(shw\.me)|(shy\.si)|(sicax\.net)|(simurl\.com)|(sina\.lt)|(sk\.gy)|(skr\.sk)|(skroc\.pl)|(slate\.me)|(smallr\.com)|(smll\.co)|(smsh\.me)|(smurl\.name)|(sn\.im)|(snipr\.com)|(snipurl\.com)|(snsw\.us)|(snurl\.com)|(soo\.gd)|(sp2\.ro)|(spedr\.com)|(spn\.sr)|(sq6\.ru)|(sqrl\.it)|(srnk\.net)|(srs\.li)|(ssl\.gs)|(starturl\.com)|(sturly\.com)|(su\.pr)|(surl\.co\.uk)|(surl\.hu)|(surl\.me)|(sux\.cz)|(sy\.pe)|(t\.cn)|(t\.lh\.com)|(ta\.gd)|(tabzi\.com)|(tau\.pe)|(tbd\.ly)|(tcrn\.ch)|(tdjt\.cz)|(tgr\.me)|(tgr\.ph)|(thesa\.us)|(thrdl\.es)|(tighturl\.com)|(tin\.li)|(tini\.cc)|(tiniuri\.com)|(tiny\.cc)|(tiny\.lt)|(tiny\.ly)|(tiny\.ms)|(tiny\.pl)|(tiny123\.com)|(tinyarro\.ws)|(tinyarrows\.com)|(tinylink\.in)|(tinytw\.it)|(tinyuri\.ca)|(tinyurl\.com)|(tinyurl\.hu)|(tinyvid\.io)|(tixsu\.com)|(tl\.gd)|(tldr\.sk)|(tllg\.net)|(tmi\.me)|(tnij\.org)|(tnw\.to)|(tny\.com)|(tny\.cz)|(to\.ly)|(to8\.cc)|(togoto\.us)|(tohle\.de)|(totc\.us)|(toysr\.us)|(tpm\.ly)|(tpmr\.com)|(tr\.im)|(tr\.my)|(tr5\.in)|(tra\.kz)|(traceurl\.com)|(trck\.me)|(trick\.ly)|(trkr\.ws)|(trunc\.it)|(turo\.us)|(tweetburner\.com)|(tweez\.me)|(twet\.fr)|(twhub\.com)|(twi\.im)|(twirl\.at)|(twit\.ac)|(twitclicks\.com)|(twitterpan\.com)|(twitterurl\.net)|(twitterurl\.org)|(twitthis\.com)|(twiturl\.de)|(twlr\.me)|(twurl\.cc)|(twurl\.nl)|(u\.bb)|(u\.mavrev\.com)|(u\.nu)|(u\.to)|(u6e\.de)|(u76\.org)|(ub0\.cc)|(uby\.es)|(ucam\.me)|(ug\.cz)|(ulmt\.in)|(ulu\.lu)|(unlc\.us)|(updating\.me)|(upzat\.com)|(ur1\.ca)|(url\.az)|(url\.co\.uk)|(url\.ie)|(url2\.fr)|(url4\.eu)|(url5\.org)|(url360\.me)|(urlao\.com)|(urlborg\.com)|(urlbrief\.com)|(urlcover\.com)|(urlcut\.com)|(urlenco\.de)|(urlhawk\.com)|(urli\.nl)|(urlin\.it)|(urlkiss\.com)|(urlot\.com)|(urlpire\.com)|(urls\.fr)|(urls\.im)|(urlshorteningservicefortwitter\.com)|(urlx\.ie)|(urlx\.org)|(urlz\.fr)|(urlzen\.com)|(urub\.us)|(usat\.ly)|(use\.my)|(utfg\.sk)|(v\.gd)|(v\.ht)|(v5\.gd)|(vaaa\.fr)|(valv\.im)|(vaza\.me)|(vb\.ly)|(vbly\.us)|(vd55\.com)|(verd\.in)|(vgn\.am)|(vgn\.me)|(viralurl\.biz)|(viralurl\.com)|(virl\.com)|(virl\.ws)|(vl\.am)|(vm\.lc)|(vov\.li)|(vsll\.eu)|(vt802\.us)|(vur\.me)|(vurl\.bz)|(vv\.vg)|(vzturl\.com)|(w1p\.fr)|(w3t\.org)|(w55\.de)|(waa\.ai)|(wapo\.st)|(wapurl\.co\.uk)|(wb1\.eu)|(web99\.eu)|(wed\.li)|(wideo\.fr)|(wipi\.es)|(wp\.me)|(wtc\.la)|(wu\.cz)|(ww7\.fr)|(wwy\.me)|(x\.co)|(x\.nu)|(x\.se)|(x\.vu)|(x2c\.eu)|(x2c\.eumx)|(x10\.mx)|(xaddr\.com)|(xav\.cc)|(xeeurl\.com)|(xgd\.in)|(xib\.me)|(xl8\.eu)|(xn--hgi\.ws)|(xoe\.cz)|(xr\.com)|(xrl\.in)|(xrl\.us)|(xt3\.me)|(xua\.me)|(xub\.me)|(xurl\.es)|(xurl\.jp)|(xurls\.co)|(xzb\.cc)|(y\.ahoo\.it)|(yagoa\.fr)|(yagoa\.me)|(yatuc\.com)|(yau\.sh)|(ye\.pe)|(yeca\.eu)|(yect\.com)|(yep\.it)|(yfrog\.com)|(yhoo\.it)|(yiyd\.com)|(yogh\.me)|(yon\.ir)|(youfap\.me)|(yourls\.org)|(ysear\.ch)|(yuarel\.com)|(yweb\.com)|(yyv\.co)|(z0p\.de)|(z9\.fr)|(zapit\.nu)|(zeek\.ir)|(zi\.ma)|(zi\.mu)|(zi\.pe)|(zip\.net)|(zipmyurl\.com)|(zkr\.cz)|(zkrat\.me)|(zkrt\.cz)|(zoodl\.com)|(zpag\.es)|(zsms\.net)|(zti\.me)|(zud\.me)|(zurl\.ws)|(zxq\.net)|(zyva\.org)|(zz\.gd)|(zzang\.kr)|(zzb\.bz))/gi)) {receivedMessage.delete(100); receivedMessage.reply("Your message was deleted because you used one or more URL-shorteners in your message.")}
    }
    
    
    //pensive react
    if(receivedMessage.content.includes("stone head") || receivedMessage.content.includes("rock head") || receivedMessage.content.includes("gay ass") || receivedMessage.content.includes("rock ass") || receivedMessage.content.includes("looking ass")) {
        receivedMessage.react(":pensive_moyai:563698867393003530")
    }
    //text editing / censoring
    if(receivedMessage.guild !== null && receivedMessage.guild !== undefined) {
            if (receivedMessage.author.bot) return;
            if (receivedMessage.content.startsWith(client.cfg.prefix)) return;

            var forbiddenChannels = ['562328246683697154', '562328446445944872', '575985149368467466', '562338340918001684', '562328726738567168', '562338454395027469', '571770555343175719']

            curChannel = receivedMessage.channel.id

            for (var i = 0; i < forbiddenChannels.length; i++) {
                if(curChannel.includes(forbiddenChannels[i])) {
                    return
                }
            }

            var editedString = client.swearDetect(receivedMessage.content)
            if(editedString.replaced) {
                console.log(console.color.yellow(`[Swear Filter] [Textmessage]`), ` "${receivedMessage.cleanContent}" => "${editedString.string}" | ${editedString.bitmap}`)

                if(receivedMessage.member.displayName.toString().length < 3) {var name = receivedMessage.author.username}
                else {var name = receivedMessage.member.displayName}

                        const embeds = receivedMessage.embeds;
                        const attachments = receivedMessage.attachments; 

                        let eURL = ''

                        if (embeds.length > 0) {

                        if(embeds[0].thumbnail && embeds[0].thumbnail.url)
                            eURL = embeds[0].thumbnail.url;
                        else if(embeds[0].image && embeds[0].image.url)
                            eURL = embeds[0].image.url;
                        else
                            eURL = embeds[0].url;

                        } else if (attachments.array().length > 0) {
                        const attARR = attachments.array();
                        eURL = attARR[0].url;
                        }

                someoneWebhook(receivedMessage)

                async function someoneWebhook(receivedMessage) {

                await receivedMessage.channel.createWebhook(name, receivedMessage.member.user.avatarURL)
                .then(webhook => webhook.edit(name, receivedMessage.member.user.avatarURL))

                    await receivedMessage.channel.fetchWebhooks().then((webhooks) => { 
                        if (webhooks.filter(w => w.owner == client.user).array().length > 0){  

                            var someoneHook = webhooks.filter(w => w.owner == client.user).first();

                            webhookSend(someoneHook)

                            async function webhookSend(someoneHook) {
                            var someoneHook = webhooks.filter(w => w.owner == client.user).first();
                                await someoneHook.send(editedString.string, {file: eURL, split: true});
                                someoneHook.delete(100)
                        }}
                    })
                    
                }
                receivedMessage.delete(200)
            }
    }
    //@someone
    if(receivedMessage.guild !== null && receivedMessage.guild !== undefined && client.cfg.atSomeone == "true") {
        if(receivedMessage.content.includes("@someone")) {
            if (receivedMessage.author.bot) return;
            if (receivedMessage.content.startsWith(client.cfg.prefix)) return;

            var memberArray = Array.from(receivedMessage.member.guild.members.filter(m => m.presence.status === 'idle' || m.presence.status === 'online'  && !m.user.bot))
            if(memberArray.length < 1) return
            var user = memberArray[Math.floor(Math.random() * memberArray.length)];
            var userPop = user.toString().split(",").pop();
            let atSomeoneVictim = userPop

            if(receivedMessage.member.displayName.toString().length < 3) {var name = receivedMessage.author.username}
            else {var name = receivedMessage.member.displayName}

                    const embeds = receivedMessage.embeds;
                    const attachments = receivedMessage.attachments; 

                    let eURL = ''

                    if (embeds.length > 0) {

                    if(embeds[0].thumbnail && embeds[0].thumbnail.url)
                        eURL = embeds[0].thumbnail.url;
                    else if(embeds[0].image && embeds[0].image.url)
                        eURL = embeds[0].image.url;
                    else
                        eURL = embeds[0].url;

                    } else if (attachments.array().length > 0) {
                    const attARR = attachments.array();
                    eURL = attARR[0].url;
                    }
            
            var content = receivedMessage.content.replace("@someone", `@someone(${atSomeoneVictim})`)

            someoneWebhook(receivedMessage)

            async function someoneWebhook(receivedMessage) {

            await receivedMessage.channel.createWebhook(name, receivedMessage.member.user.avatarURL)
            .then(webhook => webhook.edit(name, receivedMessage.member.user.avatarURL))

                await receivedMessage.channel.fetchWebhooks().then((webhooks) => { 
                    if (webhooks.filter(w => w.owner == client.user).array().length > 0){  

                        var someoneHook = webhooks.filter(w => w.owner == client.user).first();

                        webhookSend(someoneHook)

                        async function webhookSend(someoneHook) {
                        var someoneHook = webhooks.filter(w => w.owner == client.user).first();
                            await someoneHook.send(content, {file: eURL});
                            someoneHook.delete(100)
                    }}
                })
                
            }
            receivedMessage.delete(200)
        }
    }

    if(receivedMessage.guild !== null && receivedMessage.guild !== undefined) {

        let filter = msg => {
            return msg.content.length > 0;
        }

        receivedMessage.channel.awaitMessages(filter, {
            maxMatches: 5,
            time: 6 * 1000 
        }).then(collected => {
            if(collected.size > 9) {

                console.log(collected.size)

                receivedMessage.channel.setRateLimitPerUser(5, ["Fast messaging"])
                setTimeout(() => {
                    receivedMessage.channel.setRateLimitPerUser(0, ["Reset"])
                }, 30 * 1000);
            }
        })
    }

    if(receivedMessage.guild !== null && receivedMessage.guild !== undefined) {
        var introductionChannel = client.channels.get("566352036069900306")
        var introducedRole = receivedMessage.guild.roles.get("566595092102643712");
            //introduction role
            if(receivedMessage.channel == introductionChannel) {
                receivedMessage.member.addRole(introducedRole)
            }
            //reply if a specified amount of messages are sent in a row
            if(receivedMessage.guild !== null && receivedMessage.guild !== undefined) {
                var matches = parseInt(client.cfg.repeatMinimum) - 1
                var time = parseInt(client.cfg.repeatTime)

                let filter = msg => {
                    return msg.content.toLowerCase() == receivedMessage.content.toLowerCase() &&
                        msg.author !== receivedMessage.author && !msg.author.bot && msg.content.length > 0;
                }

            receivedMessage.channel.awaitMessages(filter, {
                maxMatches: matches,
                time: time * 1000 
            }).then(collected => {
                if(collected.size === matches) {

                    let randomTimeout = Math.floor(Math.random() * 1200) + 300

                    receivedMessage.channel.startTyping(1)
                    setTimeout(() => {
                        const embeds = receivedMessage.embeds;
                        const attachments = receivedMessage.attachments; 
    
                        let eURL = ''
    
                        if (embeds.length > 0) {
    
                        if(embeds[0].thumbnail && embeds[0].thumbnail.url)
                            eURL = embeds[0].thumbnail.url;
                        else if(embeds[0].image && embeds[0].image.url)
                            eURL = embeds[0].image.url;
                        else
                            eURL = embeds[0].url;
    
                        } else if (attachments.array().length > 0) {
                        const attARR = attachments.array();
                        eURL = attARR[0].url;
                        }

                        receivedMessage.channel.send(receivedMessage.content, {file: eURL}).then(receivedMessage.channel.stopTyping(1));
                    }, randomTimeout)
                    
                }
            }).catch(console.error);
        };

        if(receivedMessage.guild !== null && receivedMessage.guild !== undefined) {
            if(receivedMessage.content.match(/\bI[´'`]?( )?a?m\b/gi)) {

                let calculateRandom = Math.floor(Math.random() * 100) + 1
                let randomNumber = calculateRandom

                var forbiddenChannels = ['562328246683697154', '562328446445944872', '575985149368467466', '562338340918001684', '562328726738567168', '562338454395027469', '571770555343175719']

                curChannel = receivedMessage.channel.id
    
                for (var i = 0; i < forbiddenChannels.length; i++) {
                    if(curChannel.includes(forbiddenChannels[i])) {
                        return
                    }
                }

            
                if(chance.bool({ likelihood: parseInt(client.cfg.dadProb) }) || receivedMessage.guild.id == "559034305456898048") {

                    console.log("I'm received")

                    dadHook(receivedMessage)

                    async function dadHook(receivedMessage) {

                    var dadArray = ["https://i.imgur.com/Vazqw7E.png", "https://i.imgur.com/sdLbbCA.png", "https://i.imgur.com/kWkUwg7.png", "https://i.imgur.com/75ZMcfk.png", "https://i.imgur.com/8CJiB42.png", "https://i.imgur.com/x6eBIdv.png", "https://i.imgur.com/Yn9n6Ge.png", "https://i.imgur.com/HQqSTk6.png"]
                    var dadAvatar = dadArray[Math.floor(Math.random() * dadArray.length)]

                    await receivedMessage.channel.createWebhook("Dad", dadAvatar)
                    .then(webhook => webhook.edit("Dad", dadAvatar))

                        await receivedMessage.channel.fetchWebhooks().then((webhooks) => { 
                            if (webhooks.filter(w => w.owner == client.user).array().length > 0){  

                                var dadHook = webhooks.filter(w => w.owner == client.user).first();

                                webhookSend(dadHook)

                                async function webhookSend(dadHook) {
                                var dadHook = webhooks.filter(w => w.owner == client.user).first();

                                    var dadResponse = receivedMessage.content.match(/(?<=\bI[´'`]?( )?a?m \b)[a-zA-Z0-9 ]*/gim)
                                    if(!dadResponse) {return}
                                    var greetingArray = ["Hey", "Greetings", "Howdy", "Hi", "Welcome", "Bonjour", "Howdy-do", "Hi-ya", "What's up", "Shalom", "What's happening", "Aloha", "Hello"];
                                    var Greeting = greetingArray[Math.floor(Math.random() * greetingArray.length)]

                                    await dadHook.send(`${Greeting} ${dadResponse[0]}, I'm Dad!`);
                                    dadHook.delete(100)
                            }}
                        })
                        
                    }
                }
            }
        }
    }
}
