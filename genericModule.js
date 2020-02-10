'use strict';

let Discord = require("discord.js");
let fs = require('fs');
const EventEmitter = require('events');
let root = process.env.tropbot;
console.log('h');
module.exports = Object.assign(new EventEmitter(), {
    required: false,
    enabled: true,
    priority: 0,
    commands: new Discord.Collection(),
    events: new Discord.Collection(),
    timedFunctions: new Discord.Collection(),
    Info(moduleInfo) {
        module.exports = Object.assign(this, moduleInfo);
    },
    async Init(client) {

        if (this.hasInit || !this.name) return this.Warn(this.hasInit ? 'Module already initialized' : 'Module name not specified');
        console.log('initializing ' + this.name);
        var SQLInfo = (await this.SQLGet(client, 'modules', this.name))[0];
        this.enabled = SQLInfo.enabled[0];
        this.ID = SQLInfo.ID;
        //if(!this.enabled) return false; //If module is disabled or has already initialized, return false signalling nothing was changed (fuck you, me)
        if (!(await this.LoadFiles(client))) //Try loading all command/event files 
            throw new Error('Not all files loaded successfully'); //Throw error if something went wrong while trying to load files
        var info = this.ModuleSpecificCode(client); //Run module specific code and set name, description, and priority (optional) to result
        this.timedFunctions.forEach((funcInterval, timedFunc) => setInterval(timedFunc, funcInterval)); //Enable all timed functions, if there are any
        this.hasInit = true; //Mark that the module has been initialized
        return true; //Return true to signal a successful initialization 
    },
    async Enable(client, comOrEvName = null) {
        if ((this.enabled && !comOrEvName) || (!this.enabled && !!comOrEvName) || !this.hasInit) return this.Warn(!this.hasInit ? 'Module not initialized yet' : this.enabled ? 'Module already Enabled' : 'Module is Disabled'); //If module is already enabled and a file isn't specified or module has not initialized yet, return false signalling nothing was changed
        if (comOrEvName) //If file is specified
            return await this.ToggleSingle(client, comOrEvName, this.commands.get(comOrEvName), true, true); //Attempt enabling the file and return the result (overWrite param specified to allow overwriting event enabled value)
        this.timedFunctions.forEach((funcInterval, timedFunc) => setInterval(timedFunc, funcInterval)); //Enable all timed functions, if there are any
        return await this.Toggle(client, true); //Attempt enabling all files and return result

    },
    async Disable(client, comOrEvName = null) {
        if (!this.enabled || !this.hasInit) return this.Warn(!this.hasInit ? 'Module not initialized yet' : 'Module currently disabled'); //If module is already disabled or module has not initialized yet, return false signalling nothing was changed
        if (comOrEvName) //If file is specified
            return await this.ToggleSingle(client, comOrEvName, this.commands.get(comOrEvName), false, true); //Attempt disabling the file and return the result (overWrite param specified to allow overwriting event enabled value)
        if (this.required) return this.Warn('Module is required'); //Prevents required modules from being disabled
        this.timedFunctions.forEach((funcInterval, timedFunc) => clearInterval(timedFunc)); //Remove all timed functions, if there are any
        return await this.Toggle(client, false); //Attempt disabling all files and return result
    },
    async Reload(client, comOrEvName = null) {
        if (!this.enabled || !this.hasInit) return this.Warn(!this.hasInit ? 'Module not initialized yet' : 'Module currently disabled'); //If module is disabled or has not initialized yet, return false signalling nothing was changed
        var comOrEv = this.GetComOrEv(comOrEvName) //Try getting the file from commands or events (outside of if statement because single line if statements uwu)
        if (comOrEvName) //If file is specified
            if (!(comOrEv && comOrEv.enabled)) return this.Warn('comOrEv doesn\'t exist or is disabled'); //If file is not found or disabled, return false signalling nothing was changed
            else return (await this.LoadFile(client, `/modules/${this.name}/${comOrEv.name ? 'commands' : 'events'}/${comOrEvName}.js`, (await this.SQLGet(client, comOrEv.name ? 'commands' : 'events', comOrEvName))[0].enabled[0])); //Else, attempt reloading the file and return result    
        return await this.LoadFiles(client); //Attempt reloading all files and return result
    },
    GetComOrEv(comOrEvName) {
        return this.commands.get(comOrEvName) || this.events.get(comOrEvName);
    },
    async Toggle(client, enable) //Should not be used directly
    {
        this.enabled = enable;  //Toggles the module state 
        if (!(await this.SQLToggle(client, 'modules', this.name, enable))) return this.Warn('Module could not be toggled (SQL)');;
        //if(!this.hasInit && !this.enabled && enable) this.Init(); //Initialize if module was disabled
        var toToggle = [] //Stores results of event toggles
        if (!this.events.size) return true;
        for (var [eventName, event] in this.events)  //Toggles each file (Does not overwrite all enabled or disabled events unlike the commands since 
            toToggle.push((async () => await this.ToggleSingle(client, eventName, false, enable))());             //a parameter needs to be specified)
        var results = await Promise.all(toToggle);
        return results.includes(true); //Returns false if none of the events were changed
    },
    async ToggleSingle(client, comOrEvName, isCommand, enabled, overWrite = false) //Should not be used directly
    {
        var comOrEv = this.GetComOrEv(comOrEvName) //Attempt getting file from commands and events
        if (!(comOrEv && !comOrEv.required) || (comOrEv.enabled == enabled)) return this.Warn(`comOrEv ${comOrEvName} either doesn't exist, is required, or is already set to current value`);  //If file doesn't exist, is required, or already in the state it needs to be toggled to, return false signalling nothing was changed
        if (isCommand) //If file is command 
            comOrEv.enabled = enabled; //Overwrite existing command enabled value
        else //Else if file is not command
        {
            if (enabled) //If event needs to be enabled
                client.on(comOrEvName, comOrEv.execute); //Set up listener
            else //Else if event needs to be disabled
                client.removeListener(comOrEvName, this.events.get(comOrEvName).execute); //Remove listener
            if (overWrite) //If overWrite parameter is set (used to prevent Toggle function from overwriting all values)
                comOrEv.enabled = enabled; //Overwrite existing event enabled value
        }
        return await this.SQLToggle(client, isCommand ? 'commands' : 'events', comOrEvName, enabled);
        //return true; //Return true signalling that the file was successfully toggled
    },
    async LoadFiles(client) //Should not be used directly
    {
        var moduleFolder = root + `/modules/${this.name}`;
        var commandFiles = fs.existsSync(moduleFolder  + '/commands') ? fs.readdirSync(moduleFolder  + '/commands') : []//Get all command files
        var eventFiles = fs.existsSync(moduleFolder  + '/events') ? fs.readdirSync(moduleFolder  + '/events') : [] //Get all event files
        //var results = [] //Stores result of file loading
        var toLoad = []
        var commandSQL = await this.SQLGet(client, 'commands');
        var commandCollection = client.scripts.getCollection();
        commandSQL.forEach(commandRow => commandCollection.set(commandRow.name, commandRow.enabled[0]));
        var eventSQL = await this.SQLGet(client, 'events');
        var eventCollection = client.scripts.getCollection();
        eventSQL.forEach(eventRow => eventCollection.set(eventRow.name, eventRow.enabled[0]));

        for (const file of commandFiles)  //Loops through command files
            toLoad.push((async () => await this.LoadFile(client, `/modules/${this.name}/commands/${file}`, commandCollection.get(file.split('.')[0])))());
        for (const file of eventFiles)  //Loops through event file
            toLoad.push((async () => await this.LoadFile(client, `/modules/${this.name}/events/${file}`, eventCollection.get(file.split('.')[0])))());
        var results = await Promise.all(toLoad);
        return !results.includes(false); //Return false if something went wrong while loading the files
    },
    async LoadFile(client, fileLocation, enabled) //Should not be used directly
    {
        fileLocation = root + fileLocation;
        if (!fs.existsSync(fileLocation)) return this.Warn(`file location '${fileLocation}' doesn't exist`); //Returns false if file location is invalid
        var file = require(fileLocation); //Require file
        //delete require.cache[require.resolve(fileLocation)]; //Remove cache to prevent future improper reloads
        var fileNames = fileLocation.substring((root + `/modules/${this.name}/`).length).split('/'); //Splits location into folder and file name(.js) 
        var fileName = fileNames[1].split('.')[0]; //Gets file name without extension
        //var enabled = fileCollection.get(fileName);
        if (enabled === undefined) {
            var Type = fileNames[0];
            var Result = await this.SQLInsert(client, Type, fileName)
            if (!Result) throw new Error(`There was a problem adding the new ${Type.substring(0, Type.length - 1)} '${fileName}' to the ${Type} table`);
            enabled = true;
        }
        file.enabled = enabled;
        if (fileNames[0] == 'commands') //If folder is commands folder  
            this.commands.set(file.name, file); //Set command in collection
        else if (fileNames[0] == 'events') //Else, if folder is events folder
        {
            file.execute = file.execute.bind(null, client);
            var event = { ...file };
            event.execute = function () {
                try {
                    file.execute(...arguments)
                }
                catch (err) {
                    client.guilds.get(client.constants.testingGuild).channels.get(client.constants.errorChannel).send(`\`ERROR\` \`\`\`xl\n${client.clean(err)}\n\`\`\``);
                    //do the error thing 
                }
            }
            if (this.events.get(fileName)) //Check if event has already been addded
                client.removeListener(fileName, this.events.get(fileName).execute); //Remove listener to prevent duplicate events
            if (enabled && this.enabled)
                client.on(fileName, event.execute);  //Add new listener
            this.events.set(fileName, event); //Set event in collection 
        }
        else return this.Warn('folder name invalid type ' + fileNames[0]); //Else, folder name is invalid and return false
        return true; //Return true, signalling that the file was successfully loaded
    },
    SQLToggle(client, type, name, enabled) //Should not be used directly
    {
        return new Promise(resolve => {
            var connection = client.scripts.getSQL();
            var SQLQuery = `UPDATE \`${type}\` SET \`enabled\`= ${enabled} WHERE \`name\`= '${name}' ${(type != 'modules') ? `AND \`moduleID\` = ${this.ID}` : ''}`;
            connection.query(SQLQuery, (err, rows) => {
                if (err)
                    return reject(err)
                resolve((rows.affectedRows != 0) ? true : false)
            });
        });
    },
    SQLGet(client, type, name) //Should not be used directly
    {
        return new Promise(resolve => {
            var isModule = type == 'modules';
            var connection = client.scripts.getSQL();
            var SQLQuery = `SELECT * FROM \`${type}\` ${(name || !isModule) ? 'WHERE ' : ''}${name ? `\`name\` = '${name}'` : ''}${(name && !isModule ? ' AND ' : '')}${!isModule ? `\`moduleID\` = ${this.ID}` : ''}`;
            connection.query(SQLQuery, (err, rows) => {
                if (err)
                    return reject(err)
                resolve(rows)
            });
        });
    },
    SQLInsert(client, type, comOrEvName) //Should not be used directly
    {
        return new Promise(resolve => {
            var connection = client.scripts.getSQL();
            var SQLQuery = `INSERT INTO ${type} (\`name\`, \`enabled\`, \`moduleID\`) VALUES ('${comOrEvName}', 1, '${this.ID}')`;
            connection.query(SQLQuery, (err, rows) => {
                if (err)
                    return reject(err)
                resolve((rows.affectedRows != 0) ? true : false)
            });
        });
    },
    Warn(warnString) {
        this.emit('warn', warnString);
        return false;
    },
    ModuleSpecificCode(client) { }
});