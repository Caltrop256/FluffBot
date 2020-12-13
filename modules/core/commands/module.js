'use strict';
module.exports = {
    name: 'module',
    aliases: ['m', 'mod'],
    description: 'module, command, and event management',
    args: true,
    usage: '<enable|disable|reload> <moduleName> (<commandName|eventName>)',
    rateLimit: {
        usages: 3,
        duration: 0,
        maxUsers: 5
    },
    perms: ['DEV'],
    required: true,

    async execute(client, args, message)
    {
        var moduleArgs = args.join(" ").slice(args[0].length + 1).split(/[/#._ ]/);

        var embedError = client.scripts.getEmbed()
            .setColor(client.constants.red.hex)
            .setAuthor('Invalid Request')
            .setTimestamp();
        if (!moduleArgs.length || moduleArgs.length > 2) return message.channel.send({ embed: embedError.setDescription(`Invalid arguments, try doing \`${client.cfg.prefix[0]}help ${this.name}\``) });

        var selectedModule = client.modules.get(moduleArgs[0]);
        if (!selectedModule) return message.channel.send({ embed: embedError.setDescription(`Couldn't locate a module with the name \`${moduleArgs[0]}\``) });

        var comOrEvName = null;
        var comOrEv = null;
        if (moduleArgs[1])
        {
            comOrEv = selectedModule.GetComOrEv(moduleArgs[1]);
            if (!comOrEv) return message.channel.send({ embed: embedError.setDescription(`Couldn't locate a command or event with the name \`${moduleArgs[1]}\``) });
            comOrEvName = moduleArgs[1];
        };
        var kind = comOrEv ?
            comOrEv.name ?
                'command' :
                'event' :
            'module';

        var result = false;
        var enable = args[0].toLowerCase().startsWith('e');
        var operation = {
            type: '',
            emote: ''
        }
        switch (args[0].toLowerCase())
        {
            case 'e':
            case 'enable':
                result = await selectedModule.Enable(client, comOrEvName);
                operation.type = 'enabled';
                operation.emote = '✅';
                break;
            case 'd':
            case 'disable':
                result = await selectedModule.Disable(client, comOrEvName);
                operation.type = 'disabled';
                operation.emote = '❌';
                break;
            case 'r':
            case 'reload':
                result = await selectedModule.Reload(client, comOrEvName);
                operation.type = 'reloaded';
                operation.emote = '🔄';
                break;
            default:
                return message.channel.send({ embed: embedError.setDescription(`You can't use \`${args[0]}\` on ${kind == 'event' ? 'an' : 'a'} ${kind}!\nTry using \`enable\`, \`disable\` or \`reload\` instead`) });
        }
        var embedResult = client.scripts.getEmbed()
            .setColor(result ? operation.type == "enabled" ? client.constants.green.hex : operation.type == "disabled" ? client.constants.red.hex : client.constants.blue.hex : client.constants.redder.hex)
            .setAuthor(result ? `${operation.type.charAt(0).toUpperCase() + operation.type.slice(1)} ${kind == 'event' ? 'an' : 'a'} ${kind}` : 'Invalid Request', message.author.displayAvatarURL)
            .setTimestamp();

        if (result)
        {
            embedResult.setDescription(comOrEvName ?
                `${operation.emote} Successfully ${operation.type} the \`${comOrEvName}\` ${kind}!` :
                `${operation.emote} Successfully ${operation.type} ${selectedModule.commands.size ? `**${selectedModule.commands.size}** command${selectedModule.commands.size > 1 ? "s" : ""}` : ''} ${(selectedModule.commands.size && selectedModule.events.size) ? 'and' : ''} ${selectedModule.events.size ? `**${selectedModule.events.size}** event${selectedModule.events.size > 1 ? "s" : ""}` : ''} in the \`${selectedModule.name}\` module`
            );
        } else
        { //i really gotta clean this up ralSweat
            if (operation.type == 'disabled' && selectedModule.required && !comOrEvName)
            {
                embedResult.setDescription(`You may not disable the \`${selectedModule.name}\` module`);
            }
            else if (!selectedModule.enabled)
            {
                embedResult.setDescription(`The ${comOrEvName ? `\`${comOrEvName}\` ${kind}'s parent ` : ''}module \`${selectedModule.name}\` is currently disabled`);
            } else if (operation.type != "reloaded")
            {
                if (selectedModule.enabled == enable)
                {
                    embedResult.setDescription(`The \`${selectedModule.name}\` module is already ${operation.type}`);
                }
                if (comOrEvName)
                {
                    if (comOrEv.enabled == enable)
                    {
                        embedResult.setDescription(`The ${comOrEvName} ${kind} is already ${operation.type}`);
                    } else if (comOrEvName && comOrEv.required)
                    {
                        embedResult.setDescription(`You may not disable the \`${comOrEvName}\` ${kind}`);
                    } else embedResult.setDescription(`Unknown Error `);
                }
            } else if (!comOrEv.enabled) embedResult.setDescription(`The ${comOrEvName} ${kind} is disabled`);
            else embedResult.setDescription(`Unknown Error while reloading`);
        };

        message.channel.send({ embed: embedResult });
    }
};