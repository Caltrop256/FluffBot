'use strict';
// ready
/* Emitted when the client becomes ready to start working.    */

module.exports = {
    execute(client) {
        console.clear();
        console.log(console.color.red(`[META] [Startup]`), `Successfully started and logged in as ${client.user.tag} after ${((Date.now() - client.startUp) / 1000).toFixed(1)}s`);
        console.table(client.modules);
    }
};