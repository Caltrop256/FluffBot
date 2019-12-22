module.exports = {
    name: 'template',
    aliases: ['t', 'tp'],
    description: 'Template text for creating new commands',
    args: true,
    usage: 'lol',
    rateLimit: {
        usages: 0,
        duration: 0,
        maxUsers: 0
    },
    perms: [], 
   
    execute(client, args, message) {
        message.channel.send("uwu"); //uwu
   }
}

