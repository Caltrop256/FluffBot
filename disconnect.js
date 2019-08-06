// disconnect
/* Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
PARAMETER    TYPE              DESCRIPTION
Event        CloseEvent        The WebSocket close event    */

module.exports = (client, event) => {
    
    console.log(`Disconnected: ${event}`);
    
}