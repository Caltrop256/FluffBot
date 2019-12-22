'use strict';

module.exports = {
    name: 'testerror',
    aliases: ['throwerror'],
    description: 'don\'t even think about it',
    args: false,
    usage: '',
    rateLimit: {
        usages: 2,
        duration: 60,
        maxUsers: 2
    },
    perms: ['DEV'],

    execute(client, args, message) {
        //client.testErr();
        //client.testErrInstant();
        //client.testErrPromise();
        client.testErrInterval();
    }
}


