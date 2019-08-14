const Discord = require('discord.js');
const fs = require('fs');
var random = require("node-random");

module.exports = {
    name: 'eval',
    aliases: ['ev'],
    description: 'arbitrary code execution',
    args: true,
    usage: '<code>',
    guildOnly: false,
    rateLimit: {
      usages: Infinity,
      duration: 1,
      maxUsers: 3
  },
    permLevel: 5, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

    execute(client, arguments, receivedMessage) {
        
      if((receivedMessage.member.id != 152041181704880128) && (receivedMessage.author.id !=  214298654863917059) &&(receivedMessage.author.id !== client.cfg.ownerID)) return;
      try {
        const code = arguments.join(" ");
        let evaled = eval(code);
    
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
    
        receivedMessage.channel.send(clean(evaled), {code:"xl", split: true});
      } catch (err) {
        receivedMessage.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    

    //used for the evalCommand
    function clean(text) {
        if (typeof(text) === "string")
          return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
	}
	if(false) {
		client.channels.get("562327839937003562").fetchMessage("604595529564815362").then(async msg => {
			var n = [], s = [], g = [];
			msg.reactions.forEach(r => {
				r.fetchUsers().then(u => {
					switch(r.emoji.name) {
						case("nitro") :
							while(n.length < 4) {
								var ru = u.random().toString();
								while(n.includes(ru)) {
									ru = u.random().toString();
								};
								n.push(ru);
							};
							break;
						case("steam") :
							while(s.length < 5) {
								var ru = u.random().toString();
								while(n.includes(ru) || s.includes(ru)) {
									ru = u.random().toString();
								};
								s.push(ru);
							};
							break;
						case("💸") :
							var ru = u.random().toString();
								while(n.includes(ru) || s.includes(ru)) {
									ru = u.random().toString();
								};
							if(!g.length) g.push(ru);
							break;
					};
				});
			});
			setTimeout(async () => {
				var a = await msg.guild.roles.get("562923651679125504");
				var i = msg.guild.iconURL.replace(/jpg$/g, "gif");
				receivedMessage.channel.send(a.toString(), new Discord.RichEmbed()
				.setAuthor(`Giveaway Winners!`, i, i)
				.setDescription(`The Giveaway has concluded, below you will find the winners for each category!`)
				.setThumbnail(i)
				.setTimestamp()
				.setFooter("", i)
				.setColor(0xD4AF37)
				.addField('4x Nitro', n.join("\n"), true)
				.addField('5x 10€ Steam game', s.join("\n"), true)
				.addField('25$ giftcard of the User\'s choice', g, true)
				)
			}, 5000);
		});
	}
	if(false) {
		client.channels.get("562327839937003562").fetchMessage("604595529564815362").then(async msg=>{var n=[],s=[],g=[];msg.reactions.forEach(r=>{r.fetchUsers().then(u=>{switch(r.emoji.name){case("nitro"):while(n.length<4){n.push(u.random().toString());};break;case("steam"):while(s.length<5){s.push(u.random().toString());};break;case("💸"):if(!g.length)g.push(u.random().toString());break;};});});setTimeout(async()=>{var a=await msg.guild.roles.get("562923651679125504");receivedMessage.channel.send(a.toString(),new Discord.RichEmbed().setAuthor(`Giveaway Winners!`).setDescription(`The Giveaway has concluded, below you will find the winners for each category!`).setThumbnail(msg.guild.iconURL.replace(/jpg$/g,"gif")).setTimestamp().setColor(0xD4AF37).addField('4x Nitro',n.join("\n"),true).addField('5x 10€ Steam game',s.join("\n"),true).addField('25$ giftcard of the User\'s choice',g,true))},5000);});
	}
  }
}

