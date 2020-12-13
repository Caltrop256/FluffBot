const config = require(process.env.tropbot + '/config.json');
const blacklist = [config.stableToken, config.betaToken, config.mySQLPassword, config.fluffToken, config.voteToken, config.pToken];
module.exports = {
	name: 'eval',
	aliases: ['ev'],
	description: 'arbitrary code execution',
	args: true,
	usage: '<code>',
	rateLimit: {
		usages: Infinity,
		duration: 1,
		maxUsers: 3
	},
	perms: ['DEV'],

	async execute(client, args, message)
	{

		if ((message.member.id != 152041181704880128) && (message.author.id != 214298654863917059) && (message.author.id !== client.cfg.ownerID)) return;
		try
		{
			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);
			if (message.channel.id != '684333048694833154')
				blacklist.forEach(b => evaled = evaled.replace(RegExp(b, 'gi'), 'CENSORED'));
			message.channel.send(client.clean(evaled), { code: "xl", split: true });
		} catch (err)
		{
			message.channel.send(`\`ERROR\`\n\`\`\`xl\n${client.clean(err)}\n\`\`\``);
		}



		if (false)
		{
			client.channels.get("562327839937003562").fetchMessage("604595529564815362").then(async msg =>
			{
				var n = [], s = [], g = [];
				msg.reactions.forEach(r =>
				{
					r.fetchUsers().then(u =>
					{
						switch (r.emoji.name)
						{
							case ("nitro"):
								while (n.length < 4)
								{
									var ru = u.random().toString();
									while (n.includes(ru))
									{
										ru = u.random().toString();
									};
									n.push(ru);
								};
								break;
							case ("steam"):
								while (s.length < 5)
								{
									var ru = u.random().toString();
									while (n.includes(ru) || s.includes(ru))
									{
										ru = u.random().toString();
									};
									s.push(ru);
								};
								break;
							case ("💸"):
								var ru = u.random().toString();
								while (n.includes(ru) || s.includes(ru))
								{
									ru = u.random().toString();
								};
								if (!g.length) g.push(ru);
								break;
						};
					});
				});
				setTimeout(async () =>
				{
					var a = await msg.guild.roles.get("562923651679125504");
					var i = msg.guild.iconURL.replace(/jpg$/g, "gif");
					message.channel.send(a.toString(), client.scripts.getEmbed()
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
		if (false)
		{
			client.channels.get("562327839937003562").fetchMessage("604595529564815362").then(async msg => { var n = [], s = [], g = []; msg.reactions.forEach(r => { r.fetchUsers().then(u => { switch (r.emoji.name) { case ("nitro"): while (n.length < 4) { n.push(u.random().toString()); }; break; case ("steam"): while (s.length < 5) { s.push(u.random().toString()); }; break; case ("💸"): if (!g.length) g.push(u.random().toString()); break; }; }); }); setTimeout(async () => { var a = await msg.guild.roles.get("562923651679125504"); message.channel.send(a.toString(), new Discord.RichEmbed().setAuthor(`Giveaway Winners!`).setDescription(`The Giveaway has concluded, below you will find the winners for each category!`).setThumbnail(msg.guild.iconURL.replace(/jpg$/g, "gif")).setTimestamp().setColor(0xD4AF37).addField('4x Nitro', n.join("\n"), true).addField('5x 10€ Steam game', s.join("\n"), true).addField('25$ giftcard of the User\'s choice', g, true)) }, 5000); });
		}
	}
}

