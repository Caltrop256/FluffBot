'use strict';

module.exports = {
    name: 'spoilertest',
    aliases: ['spoiler'],
    description: 'test  uwu',
    args: true,
    usage: '<true|false>  <0|1|2> <string>',
    rateLimit: {
        usages: 10,
        duration: 5,
        maxUsers: 3
    },
    perms: ['DEV'], 
   
    async execute(client, args, message) {
        
        var toggleHalfArg = args[0].toLowerCase();
        if(!['true','false'].includes(toggleHalfArg)) return message.reply('Not True Or False Value') //.splice(2)
        if(isNaN(args[1])/* || isNaN(args[2])*/) return message.reply('Invalid Number Arg');
        var testType = parseInt(args[1]);
        //var blinkTime = parseInt(args[1]);
        //if((blinkTime > 2) || (blinkTime < 1)) return message.reply('Invalid Number Range (1-2)')
        if((testType > 2) || (testType < 0)) return message.reply('Invalid Number (0,1,2)')
        var toggleHalf = toggleHalfArg === 'true';
        var stringTest = args.splice(2).join(' ') || 'Spoiler Test';
        var stringArray = [stringTest];
        
        
    
        if(testType === 1)
        {
            stringArray = stringTest.split(' ');
        }
        else if(testType === 2)
        {
            stringArray = stringTest.split('');
        }
        var ogStringArray = Object.assign([],stringArray);
        for(var i = 0; i < stringArray.length; i++)
        {
            if(!toggleHalf || !(i % 2)) stringArray[i] = '||'+stringArray[i]+'||';
        }
        var msg = await message.channel.send(stringArray.join(' '));
        for(var count = 0;count < 2;count++)
        {
            for(var i = 0; i < stringArray.length; i++)
            {
                stringArray[i] = (!toggleHalf || (i % 2)) ? '||'+ogStringArray[i]+(!toggleHalf ? ogStringArray[i] : '') +'||' : ogStringArray[i];
                
            }
            if(!toggleHalf) await client.scripts.wait(500);
            await msg.edit(stringArray.join(' '))
            for(var i = 0; i < stringArray.length; i++)
            {
                stringArray[i] = (!toggleHalf || !(i % 2)) ? '||'+ogStringArray[i]+'||' : ogStringArray[i];
                
            }
            if(!toggleHalf) await client.scripts.wait(500);
            await msg.edit(stringArray.join(' '))
        }
        await msg.delete();
        
        
   }
}

