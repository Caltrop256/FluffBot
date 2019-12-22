'use strict';

module.exports = require(process.env.tropbot+'/genericModule.js');
module.exports.Info({
    name : 'meta',
    desc: ''
});
module.exports.ModuleSpecificCode = function(client) {
    function clean (text) {
        if (typeof(text) === "string")
          return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
    client.clean = clean;
};