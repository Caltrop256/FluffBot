const stringify = require('json-stringify-safe');
const util = require("util");
const WebSocket = require('ws');
const Module = require('module');
class Packet
{
    constructor(jsonString)
    {
        var obj = JSON.parse(jsonString);
        this.type = obj.type;
        this.data = obj.data;
    }
}
module.exports = {
    isReady: false,
    hideParent: true,
    hideClient: true,
    maxCollection: 250,
    init(client)
    {
        this.client = client;

        this.wss = new WebSocket.Server({ port: 6969 });
        this.wss.on('connection', function connection(ws)
        {
            if (this.isReady)
                this.send(ws, 'info', 'ready');
            ws.on('message', function incoming(message)
            {
                if (!this.isReady)
                    return send(ws, 'info', 'not ready');
                try
                {
                    var packetObj = new Packet(message);
                    switch (packetObj.type)
                    {
                        case 'eval':
                            {

                                var objList = client.scripts.getCollection();
                                console.log('test2');
                                var stringifyReplace = function (key, value)
                                {
                                    if (value === null)
                                        return value;
                                    else if (value === undefined)
                                        return 'undefined';
                                    var fixedVal = replaceSpecial(value);
                                    if ((typeof value === 'object') && (value != result))
                                        if (this.hideParent && checkParent(key, value))
                                            return '[{parent}]'
                                        else if (this.hideClient && ['_client', 'client'].includes(key))
                                            return '[(client)]'
                                        else if ((objList.get(key) === fixedVal) || (objList.get('_' + key) === fixedVal))
                                            return `[${key.startsWith('_') ? key.substring(1, key.length) : key}]`;
                                        else
                                            objList.set('_' + key, value);

                                    if (typeof value === 'function')
                                        return (value.name || key || result.name) ? `[Function: ${value.name || key || result.name}]` : '[Anonymous Function]';
                                    else if (typeof value == 'number')
                                    {
                                        if (isNaN(value))
                                            return 'NaN';
                                        else if (value === Infinity)
                                            return 'Infinity';
                                    } else
                                    {
                                        if (fixedVal !== value)
                                            return fixedVal;
                                    }
                                    return value;
                                }.bind(this);
                                var replaceSpecial = function (value)
                                {
                                    if (value instanceof Map)
                                        if ((result === value) || (Object.values(result).includes(value) && (value.size <= this.maxCollection)))
                                            return Array.from(value).reduce((acc, [key, val]) => Object.assign(acc, {
                                                [key]: val
                                            }), {});
                                        else
                                            return `{Collection(${value.size})}`;
                                    else if (value instanceof Promise)
                                        return util.inspect(value)
                                    else if (value instanceof Set)
                                        return Array.from(value);
                                    else if (value instanceof Module)
                                    {
                                        var modValue = { ...value };
                                        modValue.parent = !!value.parent;
                                        modValue.children = value.children.length;
                                        return modValue;
                                    } else if (value.constructor == BigInt) //Screw you BigInt for not working with instanceof lmao
                                        return `${value}n`;
                                    else
                                        return value;
                                }.bind(this);
                                var checkParent = function (key, value)
                                {
                                    if (!Object.entries(result).some(arr => ((arr[0] == key) && (arr[1] == value)))) return false;
                                    return Object.values(value).includes(result)
                                    //return Object.values(value).some(val => ((val !== null) && (typeof val == 'object')) && Object.values(val).includes(result))
                                }
                                var stringifyCircular = function (key, value)
                                {
                                    return `[(${key})]`;
                                };
                                var log = function ()
                                {
                                    var args = arguments.length ? ((arguments.length === 1) ? arguments[0] : arguments) : undefined
                                    result = args;
                                    this.send(ws, 'log', stringify(args, stringifyReplace, 2, stringifyCircular));
                                }.bind(this);
                                var setCommandMessage = function (url)
                                {
                                    client.scripts.getMessageFromLink(client, url).then(msg =>
                                    {
                                        log(msg);
                                        msg.delete = () => { log('Tried to delete command message') };
                                        client.commandMessage = msg;
                                    }).catch(err =>
                                        log(err)
                                    );
                                }
                                var runCommand = function (commandName, args)
                                {
                                    if (!client.commandMessage) return false;
                                    if (typeof commandName !== 'string') return false;
                                    if (!(args instanceof Array))
                                        if (typeof args === 'string')
                                            args = [args];
                                        else if ((args === null) || (args === undefined))
                                            args = [];
                                        else
                                            return false

                                    for ([name, mod] of client.modules)
                                    {
                                        if ((command = mod.GetComOrEv(commandName)) && command.name)
                                            return command.execute(client, args, client.commandMessage);
                                    }
                                    return false;

                                }
                                var result = eval(packetObj.data);

                                this.send(ws, 'eval', stringify(result, stringifyReplace, 2, stringifyCircular));
                            }
                            break;
                        case 'command':
                            {
                                switch (packetObj.data)
                                {
                                    case 'restart':
                                        {
                                            this.broadcast('restart', { hideClient: this.hideClient, hideParent: this.hideParent, maxCollection: this.maxCollection })
                                            return this.restart(client);
                                        }
                                    case 'toggleParent':
                                        {
                                            this.hideParent = !this.hideParent
                                            return this.send(ws, 'toggleParent', this.hideParent)
                                        }
                                    case 'toggleClient':
                                        {
                                            this.hideClient = !this.hideClient
                                            return this.send(ws, 'toggleClient', this.hideClient)
                                        }
                                    case 'getVariables':
                                        {
                                            return this.send(ws, 'log', JSON.stringify({ hideClient: this.hideClient, hideParent: this.hideParent, maxCollection: this.maxCollection }))
                                        }
                                }
                            }
                            break;
                        case 'intellisense':
                            {
                                function getObj(baseObj, objStr)
                                {
                                    try
                                    {
                                        var objSplit = objStr.split('.')
                                        var currentObj = baseObj;
                                        for (i = 0; i < objSplit.length; i++)
                                        {
                                            currentObj = currentObj[objSplit[i]];
                                        }
                                        return currentObj;
                                    } catch {
                                        return;
                                    }
                                }
                                var stringObj = packetObj.data;
                                var keyObj = (stringObj == 'global') ? global : (stringObj == 'this') ? this : (getObj(global, stringObj) || getObj(this, stringObj) || []);

                                this.send(ws, 'intellisense', JSON.stringify(Object.keys(keyObj)));
                            }
                            break;
                        case 'reconnectInfo':
                            {
                                var data = packetObj.data
                                this.hideClient = data.hideClient;
                                this.hideParent = data.hideParent;
                                this.maxCollection = parseInt(data.maxCollection);
                                this.send(ws, 'reconnectInfo', data);
                            }
                            break;
                        case 'setMaxCollection':
                            {
                                this.maxCollection = parseInt(packetObj.data);
                                return this.send(ws, 'maxCollection', this.maxCollection)
                            }
                            break;
                    }
                } catch (err)
                {
                    if (err)
                        console.error(err.stack || err);
                    this.send(ws, 'error', JSON.stringify(err.toString()));
                }
            }.bind(this));

        }.bind(this));
    },
    stop(cb = (err) => { })
    {
        this.wss.clients.forEach((client) =>
        {
            client.close(1012);
        })
        this.wss.close(cb);
    },
    restart(client)
    {
        this.stop((err) =>
        {
            if (err)
                console.log(`[socket] ${err}`);
            client.startREPLServer();
        });
    },
    broadcast(type, info)
    {
        this.wss.clients.forEach((client) =>
        {
            this.send(client, type, info);
        })
    },
    send(ws, type, data)
    {
        ws.send(JSON.stringify({ type: type, data: data }));
    }
}