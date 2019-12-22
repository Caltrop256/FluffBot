// error
/* Emitted whenever the client's WebSocket encounters a connection error.
PARAMETER    TYPE     DESCRIPTION
error        Error    The encountered error    */

module.exports = {
    execute(client, error) {
        console.error(error);
    }
};