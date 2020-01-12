'use strict';

module.exports = require(process.env.tropbot + '/genericModule.js');
module.exports.Info({
    name: 'music',
    desc: ''
});
module.exports.ModuleSpecificCode = function (client) {
};