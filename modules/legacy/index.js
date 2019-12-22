'use strict';

module.exports = require(process.env.tropbot+'/genericModule.js');
module.exports.Info({
    name : 'legacy',
    desc: ''
});
module.exports.ModuleSpecificCode = function(client) {
    client.testErrAsync = async function(){
        for(var i = 0;  i < 10000; i++)
        {
            continue; //placeholder code to simulate processing wait
        }
        throw Error('Test');
    }
    client.testErrPromise = function(){
        return new Promise((resolve,reject) =>{
            for(var i = 0;  i < 10000; i++)
            {
                continue; //placeholder code to simulate processing wait
            }
            throw Error('Test');
        })
    }
    client.testErr = function(){
        for(var i = 0;  i < 10000; i++)
        {
            continue; //placeholder code to simulate processing wait
        }
        throw Error('Test');
    }
    client.testErrInstant = function(){
        throw Error('Test');
    }
    client.testErrInterval = function(){
        setInterval(() => {
            var connection = client.scripts.getSQL();
        },10);
    }
};