// debug
/* Emitted for general debugging information.
PARAMETER    TYPE         DESCRIPTION
info         string       The debug information    */

module.exports = (client, debug) => {

    if(!debug.toString().includes("Sending a heartbeat") || !debug.toString().includes("Heartbeat acknowledged")) {
        //console.log(`debug: ${debug}`);
    }
    
    
}