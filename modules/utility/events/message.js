// message
/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
message        Message        The created message    */

module.exports = {
    async execute(client, message) {

        var msg = message.content;
        //if((msg === '💙') && (message.author.id === '188347819449384960')) :(
        //return message.react(':darxheart:562330227158548492'); :(
        //maybe add custom wave thing
        var forbiddenChannels = ['562328246683697154', '562328446445944872', '575985149368467466', '562338340918001684', '562328726738567168', '562338454395027469', '571770555343175719']
        let curChannel = message.channel.id
        for (var i = 0; i < forbiddenChannels.length; i++) {
            if (curChannel.includes(forbiddenChannels[i])) {
                return;
            };
        };

        /*if(message.author.id === '272906208694763535' && message.channel.type === 'text'){
            var regexTest = /^(what|wtf)( (the fuck|even)('s| is)|'s| is| does) (a |)/gi;
            var meanTest = /mean(\?|)$/;
            var testMatch = msg.replace(regexTest,'')
            var utilityModule = client.modules.get('utility');
            var defineCommand = utilityModule.commands.get('define');
            var keithUser = message.guild.members.get('272906208694763535').user;
            if ((testMatch !== msg) && !testMatch.startsWith('the')) {
                message.delete()
                if (defineCommand.enabled)
                    await defineCommand.execute(client, testMatch.replace(meanTest, '').trim().split(' '), { author: keithUser, channel: await keithUser.createDM() });
            }
                
            
        }*/
        var spaceless = msg.replace(/( )/g, '')
        if (spaceless.match(/^(h|н){1,}$/gi)) {
            if (spaceless.length < 10) {
                message.react("🗜") // he hacc, he reacc, but most importantly, he cute. he's caltrop
            }
            if (spaceless.length > 9) {
                message.react(":calpression:609496157122723840")
            }
        };
        let toBeMatched = msg + " .";
        let match = toBeMatched.match(/(?<=w(h?[aeiou](t|d)|tf)(([`'´]?s (even)?) *| *(even)?(the f[aeiou]c(c|k)*([`'´]?s)?)? *(is|[`'´]?s|does)) )(.+?)(?=([^a-zA-Z0-9`'´ ]|mean)(\n)?)/gim);
        if (match && (client.scripts.randBool(5))) {
            let str = match[0].replace(/(^ *(an? ?)?| *$)/g, '');
            console.log(str);
            client.modules.get('utility').commands.get('define').execute(client, [str], message);
        };

        if (msg.match(/(w(h(a{1,})t?)?)( )?t(h(e{1,}))?( )?f((u{1,})c[c|k])?/gi)) { message.react(":ralsei_angry:562330227947339806") }
        if (msg.match(/((mods?( )?(are|=)?( )?gay)|((gay)( )?mods?( )?(are|=)?))/gi)) { message.reply("It is known.") }
        if (msg.match(/milk/gi)) { message.react("🥛") }
        if (msg.match(/compress/gi)) { message.react("🗜") }
        if (msg.match(/[e∑]gg/gi) || (['eg', '∑g'].includes(message.content))) { message.react("🥚") }
        if (msg.match(/\bbr+([au]+)(h+)?(\b|$)/gi)) { message.react("🗿") }
        if (msg.match(/society/gi)) message.react("🤡");
        if (msg.match(/undefined/gi)) message.react(":RalSweat:592826306027061259");
        if (msg.match(/bo(o+)ped/) || msg.match(/bo(o+)ping/) || msg.match(/\*bo(o+)ps/) || msg.toLowerCase().includes('uwu')) message.react(":uwu:562330233446072321");
    }
};