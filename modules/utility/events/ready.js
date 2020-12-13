'use strict';
// ready
/* Emitted when the client becomes ready to start working.    */

module.exports = {
    execute(client)
    {
        let roleChannel = client.channels.get("562328013371605012");
        let ruleChannel = client.channels.get("562586739819151370");
        let message_id_color = client.cfg.color1;
        let message_id_color2 = client.cfg.color2;
        let message_id_other = client.cfg.other;
        let message_id_pronouns = client.cfg.pronouns;

        let message_id = client.cfg.ruleAccept;

        ruleChannel.fetchMessage(message_id).then(() =>
        {
            console.log(console.color.magenta(`[Rule-Selection]`), "Cached rules reaction message.");
        }).catch(e =>
        {
            console.error("Error loading message.");
            console.error(e);
        });

        roleChannel.fetchMessage(message_id_color).then(() =>
        {
            console.log(console.color.magenta(`[Role-Selection]`), "Cached color reaction message.");
        }).catch(e =>
        {
            console.error("Error loading message.");
            console.error(e);
        });

        roleChannel.fetchMessage(message_id_color2).then(() =>
        {
            console.log(console.color.magenta(`[Role-Selection]`), "Cached color2 reaction message.");
        }).catch(e =>
        {
            console.error("Error loading message.");
            console.error(e);
        });

        roleChannel.fetchMessage(message_id_other).then(() =>
        {
            console.log(console.color.magenta(`[Role-Selection]`), "Cached other reaction message.");
        }).catch(e =>
        {
            console.error("Error loading message.");
            console.error(e);
        });

        roleChannel.fetchMessage(message_id_pronouns).then(() =>
        {
            console.log(console.color.magenta(`[Role-Selection]`), "Cached pronouns reaction message.");
        }).catch(e =>
        {
            console.error("Error loading message.");
            console.error(e);
        });
    }
};