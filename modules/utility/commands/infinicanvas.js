module.exports = {
    name: 'infinicanvas',
    aliases: ['canvas', 'ic'],
    description: 'Provides link to canvas site',
    args: false,
    usage: '',
    rateLimit: {
        usages: 1,
        duration: 60,
        maxUsers: 1
    },
    perms: [],

    execute(client, args, message)
    {
        message.channel.send("https://canvas.caltrop.dev/");
    }
}

