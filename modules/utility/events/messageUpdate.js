// messageUpdate
/* Emitted whenever a message is updated - e.g. embed or content change.
PARAMETER     TYPE           DESCRIPTION
oldMessage    Message        The message before the update
newMessage    Message        The message after the update    */

module.exports = {
    execute(client, oldMessage, newMessage) {
        var msg = newMessage.content
        var spaceless = msg.replace(/( )/g, '')
        if(spaceless.match(/^h{1,}$/gi)) {
            if(spaceless.length < 10) {
                newMessage.react("🗜") // reacc box
            }
            if(spaceless.length > 9) {
                newMessage.react(":calpression:609496157122723840")
            }
        }
        if(msg.match(/(w(h(a{1,})t?)?)( )?t(h(e{1,}))?( )?f((u{1,})c[c|k])?/gi)) {newMessage.react(":ralsei_angry:562330227947339806")}
        if(msg.match(/((mods?( )?(are|=)?( )?gay)|((gay)( )?mods?( )?(are|=)?))/gi)) {newMessage.reply("It is known.")}
        if(msg.match(/milk/gi)) {newMessage.react("🥛")}
        if(msg.match(/compress/gi)) {newMessage.react("🗜")}
        if(msg.match(/[e∑]gg/gi) || (['eg','∑g'].includes(newMessage.content))) {newMessage.react("🥚")}
        if(msg.match(/\bbr+([au]+)(h+)?(\b|$)/gi)) {newMessage.react("🗿")}
    }
}