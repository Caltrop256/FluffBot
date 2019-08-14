const Discord = require('discord.js');
const fs = require('fs');
const Canvas = require('canvas');

module.exports = {
    name: 'upvotizer',
    aliases: ['starboardtest'],
    description: 'test',
    args: true,
    usage: '<string1> <string2>',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

async execute(client, arguments, receivedMessage) {

    const canvas = Canvas.createCanvas(300, 300);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./images/starboard_template.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#FFD700';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '128px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${arguments[0]}`, canvas.width / 2, canvas.height / 2.6);

	ctx.font = '128px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${arguments[1]}`, canvas.width / 2, canvas.height / 1.07);


    const attachment = new Discord.Attachment(canvas.toBuffer(), 'h.png');
    
    var starboardembed = new Discord.RichEmbed()
    .setAuthor(receivedMessage.member.displayName, receivedMessage.author.displayAvatarURL, receivedMessage.url)
    .setFooter(`Score: ${arguments[0] - arguments[1]}`)
    .setDescription(`[[Jump to Message](${receivedMessage.url})]`)

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