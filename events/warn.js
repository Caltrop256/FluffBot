// warn
/* Emitted for general warnings. 
PARAMETER    TYPE       DESCRIPTION
info         string     The warning   */

const Discord = require('discord.js');
const config = require("../commands/json/config.json");
const fs = require('fs');
const embedReder = 0xFF0000

module.exports = (client, info) => {
    
    let warnChannel =  client.channels.get("562338340918001684");
    warnChannel.send(new Discord.RichEmbed().setAuthor("Warn").setDescription(`A problem has occured, this may not be a large Issue, if this problem persists please message **Caltrop#0001**.`).addField("Warn:", "`" + error + "`").setColor(embedReder))
    
}