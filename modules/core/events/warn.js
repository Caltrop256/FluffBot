// warn
/* Emitted for general warnings. 
PARAMETER    TYPE       DESCRIPTION
info         string     The warning   */

module.exports = {
    execute(client, info) {
        console.info(info);
    }
};