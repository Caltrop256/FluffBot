// error
/* Emitted whenever the client's WebSocket encounters a connection error.
PARAMETER    TYPE     DESCRIPTION
error        Error    The encountered error    */

const Discord = require('discord.js');
const config = require("../commands/json/config.json");
const fs = require('fs');
const embedReder = 0xFF0000

module.exports = (client, error) => {
    
    let warnChannel = client.channels.get("562338340918001684");
    warnChannel.send(new Discord.RichEmbed().setAuthor(":(").setDescription(`oh oh, you weren't supposed to see this message, if this Error persists, please message **Caltrop#0001**`).addField("Error:", "`" + error + "`").setColor(embedReder))
    
}