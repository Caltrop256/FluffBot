// debug
/* Emitted for general debugging information.
PARAMETER    TYPE         DESCRIPTION
info         string       The debug information    */

module.exports = {
    execute(client, info)
    {
        if (!info.toLowerCase().includes('heartbeat'))
            console.info(info);
    }
};