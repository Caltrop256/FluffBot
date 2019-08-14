const Discord = require('discord.js');

module.exports = {
	name: 'fetchmeagrave',
	aliases: ['grave', 'rip'],
	description: 'Fetches a grave for a person',
	args: false,
	usage: 'user',
	guildOnly: true,
	rateLimit: {
		usages: 2,
		duration: 10,
		maxUsers: 5
	},
	permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
	Enabled: true,
	
  	execute(client, arguments, receivedMessage) {
		var user = client.getMemberFromArg(receivedMessage, arguments, 0)
		if (!user) return receivedMessage.reply("Couldn't find User.")
		var graveEmbed = new Discord.RichEmbed()
        	.setAuthor(`⚰️ Here lies ${receivedMessage.member.displayName}`)
        	.setImage('https://northcoastcourier.co.za/wp-content/uploads/sites/73/2013/09/grave.jpg')
        	.setTimestamp()
        	.setColor(embedPerfect_Orange)
		
		receivedMessage.channel.send({embed: graveEmbed})
	};
};

const embedPerfect_Orange = 0xFF7D00
