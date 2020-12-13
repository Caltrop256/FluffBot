// messageUpdate
/* Emitted whenever a message is updated - e.g. embed or content change.
PARAMETER     TYPE           DESCRIPTION
oldMessage    Message        The message before the update
newMessage    Message        The message after the update    */

module.exports = {
    execute(client, oldMessage, newMessage)
    {
        var msg = newMessage.content;

        var forbiddenChannels = ['562328246683697154', '562328446445944872', '575985149368467466', '562338340918001684', '562328726738567168', '562338454395027469', '571770555343175719', '592484818311446528', '716018931965493389']
        let curChannel = newMessage.channel.id
        for (var i = 0; i < forbiddenChannels.length; i++)
        {
            if (curChannel.includes(forbiddenChannels[i]))
            {
                return;
            };
        };

        var spaceless = msg.replace(/( )/g, '')
        if (spaceless.match(/^(h|н){1,}$/gi))
        {
            if (spaceless.length < 10)
            {
                newMessage.react("🗜") // reacc box
            }
            if (spaceless.length > 9)
            {
                newMessage.react(":calpression:609496157122723840")
            }
        }
        if (msg.match(/(w(h(a{1,})t?)?)( )?t(h(e{1,}))?( )?f((u{1,})c[c|k])?/gi)) { newMessage.react(":ralsei_angry:562330227947339806") }
        if (msg.match(/((mods?( )?(are|=)?( )?(homo|gay))|((gay)( )?mods?( )?(are|=)?))/gi)) { newMessage.reply("It is known.") }
        if (msg.match(/milk/gi)) { newMessage.react("🥛") }
        if (msg.match(/compress/gi)) { newMessage.react("🗜") }
        if (msg.match(/[e∑]gg/gi) || (['eg', '∑g'].includes(newMessage.content))) { newMessage.react("🥚") }
        if (msg.match(/\bbr+([au]+)(h+)?(\b|$)/gi)) { newMessage.react("🗿") }
        if (msg.match(/society/gi)) newMessage.react("🤡");
        if (msg.match(/undefined/gi)) newMessage.react(":RalSweat:592826306027061259");
        if (msg.match(/bo(o+)ped/gi) || msg.match(/bo(o+)ping/gi) || msg.match(/\*bo(o+)ps/gi) || msg.toLowerCase().includes('uwu')) newMessage.react(":uwu:562330233446072321");
        //if (msg.match(/fr(ance|ench)/gi)) message.react(':heart_fr:690714556472754178');
    }
}