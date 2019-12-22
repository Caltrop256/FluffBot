'use strict';
module.exports = {
    name: 'analytics',
    aliases: ['anal'],
    description: 'Displays the amount of times a Command has been used',
    args: false,
    usage: '',
    rateLimit: {
        usages: 1,
        duration: 20,
        maxUsers: 1
    },
    perms: ['VIEW_CHANNEL', 'READ_MESSAGES', 'SEND_MESSAGES'],

    execute(client, args, message) {
        message.react("😏")

        var reqPage = args[0] ? parseInt(args[0]) : 1
        if (isNaN(reqPage) || reqPage <= 0) reqPage = 1
        var cmds = [];
        client.modules.forEach((module, moduleName) => {
            module.commands.forEach((command, commandName) => {
                cmds.push(command);
            })
        });

        var connection = client.scripts.getSQL()

        connection.query(`SELECT * FROM cmdanal`, async(err, rows) => {
            if (err) return message.reply(`Error: ${err}`)
            cmds.forEach((cmd, index) => {
                var foundcmd = rows.find(r => r.cmdname == cmd.name)
                cmds[index].uses = foundcmd ? foundcmd.uses : 0
            })

            var leaderboardEmbed = client.scripts.getEmbed()
                .setAuthor(`Anal for all ${cmds.length} commands!`, message.author.avatarURL, message.author.avatarURL)
                .setDescription(`Below you will find use analytics for every command.`)
                .setColor(0x74B979)
                .setThumbnail(message.guild.iconURL.replace(/jpg$/g, "gif"))

            var LeaderBoard = ''
            var maxLength = 24
            await cmds.forEach((cmds, index) => {
                if (index % 2) {
                    LeaderBoard += `${cmds.name.padEnd(maxLength, " -")} ${cmds.uses}\n`
                } else LeaderBoard += `${cmds.name.padEnd(maxLength, "- ")} ${cmds.uses}\n`
            })

            var LeaderboardArray = LeaderBoard.split('\n')
            LeaderboardArray.length = LeaderboardArray.length - 1
            var chunkArray = [];
            var step = 1
            while (LeaderboardArray.length > 0) {
                var chunk = LeaderboardArray.splice(0, 10)
                chunkArray.push({ page: step, content: chunk })
                step++
            }
            if (reqPage > chunkArray.length) reqPage = chunkArray.length
            leaderboardEmbed.addField(`Page ${reqPage}`, `\`\`\`${chunkArray[reqPage-1].content.join("\n")}\`\`\``)
            leaderboardEmbed.setFooter(`Page ${reqPage}/${chunkArray.length}`)

            client.embedSelect(leaderboardEmbed, client.embedConfig(message.channel, message, 0, chunkArray.length - 1), (reqPage) => {

                leaderboardEmbed.fields[0] = {
                    name: `Page ${reqPage+1}`,
                    value: `\`\`\`${chunkArray[reqPage].content.join("\n")}\`\`\``
                }
                leaderboardEmbed.setFooter(`Page ${reqPage+1}/${chunkArray.length}`)
            })


        })
    }
}