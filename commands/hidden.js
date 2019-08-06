const Discord = require('discord.js');
const randomImage = require('random-puppy');
const fs = require('fs');
const https = require('https');



module.exports = {
    name: 'hidden',
    aliases: ['secret'],
    description: ';)',
    args: true,
    usage: '<specifier>',
    guildOnly: true,
    rateLimit: {
        usages: 1,
        duration: 60,
        maxUsers: 1
    },
    permLevel: 0, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,
   
   execute(client, arguments, receivedMessage) {
    receivedMessage.delete(100);

    //oh oh, I dropped my bowl of Kuroo :(

    if (arguments[0] == "bowl") {

        receivedMessage.channel.send("oh oh").then((msg) => {
            msg.edit("I dropped").then((msg) => {
                msg.edit("my bowl").then((msg) => {
                    msg.edit("of Kuroo").then((msg) => {
                        msg.edit(":(").then((msg) => {
                            msg.react(client.emojis.get("562330228006060032")).then((msg) => {
                                msg.delete(1000)
                                })
                            })
                        })
                    })
                })
            })
        }

        if (arguments[0] == "ralsei") {

            let randomNumber = Math.floor(Math.random() * 168) + 1
            let ralseipic = "./pfp/ralsei (" + randomNumber +").jpg"
            receivedMessage.channel.send({file: ralseipic})
        }
            
        if(arguments[0] == "cheese") {
            
        }
        if(arguments[0] == "botCheck") {
            var user = client.getMemberFromArg(receivedMessage, arguments, 1)
            if(user.user.avatarURL) {
                console.log("has avatar")
            } else {
                console.log("no avatar")
            }
        }
        
        
    }
}