const Discord = require('discord.js');
const fs = require('fs');
const Canvas = require('canvas');

const embedGreen = 0x74B979
const embedPerfect_Orange = 0xFF7D00

module.exports = {
    name: 'randomactiveuser',
    aliases: ['rac'],
    description: 'fetches a random active user',
    args: false,
    usage: '',
    guildOnly: true,
    rateLimit: {
        usages: 2,
        duration: 20,
        maxUsers: 10
    },
    permLevel: 2, //0 = none, 1 = MANAGE_MESSAGES, 2 = MANAGE_GUILD, 3 = ADMINISTRATOR, 4 = guild.ownerID, 5 = Caltrop
    Enabled: true,

async execute(client, arguments, receivedMessage) {

        var beforeMessageID = receivedMessage.id

        var limit = arguments[0] ? parseInt(arguments[0]) : 1000
        var min4active = arguments[1] ? parseInt(arguments[1]) : 100



        var mainGuild = client.guilds.get("562324876330008576");
        var messagesArray = [];
        mainGuild.channels.forEach(async channel => {
            if(channel.type == "text") {
                if(channel.parentID == "562326933447114752" || channel.parentID == "562327015567654932" || channel.parentID == "56233635422325968") {

                    const sum_messages = [];
                    let last_id;
                    const options = { limit: 100, before: beforeMessageID};
                    if (last_id) {
                        options.before = last_id;
                    }
                    while (true) {
                        const messages = await channel.fetchMessages(options);
                        sum_messages.push(...messages.array());
                        last_id = messages.last().id;

                        console.log(`#${channel.name} - Fetched ${sum_messages.length}/${limit} (${(sum_messages.length / limit * 100)}%)`)
                
                        if (messages.size != 100) {
                            break;
                        }
                        if(sum_messages.length > limit) {
                            break;
                        }
                    }
                    messagesArray.push(...sum_messages)
                }
            }
        })
        setTimeout(async () => {
            var UserMessages = new Discord.Collection()
            console.log(messagesArray.length)
            messagesArray.forEach(async msg => {
                if(!msg.author) console.log("oh oh, you dun goofed")

                var collec = UserMessages.get(msg.author.id)
                if(collec) {
                    UserMessages.set(msg.author.id, {id: msg.author.id, messages: collec.messages+=1})
                } else {
                    UserMessages.set(msg.author.id, {id: msg.author.id, messages: 1})
                }
                
            })
            var activeUsers = [];
            UserMessages.forEach(u => {
                if(u.messages >= min4active) activeUsers.push(u.id)
            })
            var user = await mainGuild.fetchMember(activeUsers[Math.floor(Math.random() * activeUsers.length)])
            receivedMessage.channel.send(`In the past ${messagesArray.length} messages, ${activeUsers.length} users have sent over ${min4active} messages, that's ${activeUsers.length}/${UserMessages.size} of users.\nI have randomly selected ${user} to win.`)
        }, limit * 7);
    }
}