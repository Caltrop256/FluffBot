// roleUpdate
/* Emitted whenever a guild role is updated.
PARAMETER      TYPE        DESCRIPTION
oldRole        Role        The role before the update
newRole        Role        The role after the update    */

module.exports = {
    async execute(client, oldRole, newRole)
    {
        const entry = await newRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' }).then(audit => audit.entries.first());

        client.lastSeen(entry.executor, `Updated the ${newRole.name} role`)

        var arr = [];
        if (oldRole.calculatedPosition != newRole.calculatedPosition) arr.push(`Moved \`${oldRole.comparePositionTo(newRole)}\` positions`);
        if (oldRole.hexColor != newRole.hexColor) arr.push(`Changed color\`${oldRole.hexColor}\` => \`${newRole.hexColor}\``);
        if (oldRole.hoist != newRole.hoist) arr.push(`The role is no${newRole.hoist ? 'w' : 't'} visible in the sidebar ${newRole.hoist ? '' : 'anymore'}`);
        if (oldRole.mentionable != newRole.mentionable) arr.push(`The role is no${newRole.mentionable ? 'w' : 't'} mentionable ${newRole.mentionable ? '' : 'anymore'}`);
        if (oldRole.name != newRole.name) arr.push(`changed name: \`${oldRole.name}\` => \`${newRole.name}\``);
        if (oldRole.permissions != newRole.permissions) arr.push(`Changed permissions: ${client.scripts.endListWithAnd(client.scripts.decodePermBitfield(oldRole.permissions).map(p => `\`${p.replace(/_/g, ' ').toLowerCase()}\``))}\n__**TO**__\n${client.scripts.endListWithAnd(client.scripts.decodePermBitfield(newRole.permissions).map(p => `\`${p.replace(/_/g, ' ').toLowerCase()}\``))}`);

        client.createLogEntry(
            client,
            `${entry.executor.tag}`,
            `${entry.executor.toString()} updated the ${newRole.toString()} role`,
            arr,
            entry.executor.id,
            client.constants.neonPink.hex,
            true
        );
    }
}