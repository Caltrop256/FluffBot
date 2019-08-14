const Discord = require('discord.js');
const config = require("./json/config.json");
const Canvas = require('canvas');
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

module.exports = {
    name: 'karma',
    aliases: ['upvotes', 'downvotes', 'score'],
    description: 'Displays the Karma and Awards of a user',
    args: false,
    usage: '<@user>',
    guildOnly: true,
    rateLimit: {
        usages: 5,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,


   async execute(client, arguments, receivedMessage) {
       var user = client.getMemberFromArg(receivedMessage, arguments)
       if(!user) return receivedMessage.reply(`Couldn't find that user.`)

       var collection = client.userKarma.get(user.user.id)
       if(collection) {
            const canvas = Canvas.createCanvas(300, 300);
            const ctx = canvas.getContext('2d');
        
            const background = await Canvas.loadImage('./images/starboard_template.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
            ctx.strokeStyle = '#FFD700';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            if(collection.up.toString().length <= 2) {
                ctx.font = '128px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${collection.up}`, canvas.width / 2.4, canvas.height / 2.6);
            } else {
                ctx.font = '95px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${collection.up}`, canvas.width / 2.4, canvas.height / 2.6);
            }

            if(collection.down.toString().length <= 2) {
                ctx.font = '128px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${collection.down}`, canvas.width / 2.4, canvas.height / 1.07);
            } else {
                ctx.font = '95px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${collection.down}`, canvas.width / 2.4, canvas.height / 1.07);
            }

            var Awards = ``
            var platemoji = client.emojis.get("586161821338042379"); Awards += `${platemoji}x${collection.plat}\n`
            var goldemoji = client.emojis.get("586161821551951882"); Awards += `${goldemoji}x${collection.gold}\n`
            var silveremoji = client.emojis.get("586161821044441088"); Awards += `${silveremoji}x${collection.silver}\n`
        
            
            var starboardembed = new Discord.RichEmbed()
            .setAuthor(user.displayName + "'s Karma", user.user.displayAvatarURL)
            .setFooter(`Karma: ${collection.up - collection.down}`)
            .setDescription(Awards)
            .setColor(user.displayHexColor)
            .setTimestamp();
        
            starboardembed.thumbnail = {
                url: "attachment://votes.png"
            }
        
            receivedMessage.channel.send({
                embed: starboardembed,
                files: [{
                attachment:canvas.toBuffer(),
                name:'votes.png'
                }]
            });
       } else {
        const canvas = Canvas.createCanvas(300, 300);
        const ctx = canvas.getContext('2d');
    
        const background = await Canvas.loadImage('./images/starboard_template.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        ctx.strokeStyle = '#FFD700';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
        ctx.font = '128px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`0`, canvas.width / 2, canvas.height / 2.6);
    
        ctx.font = '128px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`0`, canvas.width / 2, canvas.height / 1.07);

        var Awards = ``
        var platemoji = client.emojis.get("586161821338042379"); Awards += `${platemoji}x0\n`
        var goldemoji = client.emojis.get("586161821551951882"); Awards += `${goldemoji}x0\n`
        var silveremoji = client.emojis.get("586161821044441088"); Awards += `${silveremoji}x0\n`
    
        
        var starboardembed = new Discord.RichEmbed()
        .setAuthor(user.displayName + "'s Karma", user.user.displayAvatarURL)
        .setFooter(`Karma: 0`)
        .setDescription(Awards)
        .setColor(user.displayHexColor)
        .setTimestamp();
    
        starboardembed.thumbnail = {
            url: "attachment://votes.png"
        }
    
        receivedMessage.channel.send({
            embed: starboardembed,
            files: [{
            attachment:canvas.toBuffer(),
            name:'votes.png'
            }]
        });
       }
   }
}