'use strict'
const Canvas = require('canvas')
const config = require('../config.json');
var Colors = new Array();

class Color {
    constructor(name, hex, isEmoji = true) {
        this.isEmoji = isEmoji;
        this.name = name.toString();
        this.hex = hex;
        this.rgb = [parseInt(this.hex, 16) >> 16, (parseInt(this.hex, 16) >> 8) & 255, parseInt(this.hex, 16) & 255];

        this.emojify = function (client) {
            const canvas = Canvas.createCanvas(50, 50);
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "#" + this.hex;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            return client.guilds.get(client.constants.emoteGuild).createEmoji(
                canvas.toBuffer(),
                "color_" + this.name.toLowerCase().replace(/ /g, "_")
            );
        };
        this.getEmoji = function (client) {
            if (this.isEmoji)
                return client.guilds.get(client.constants.emoteGuild).emojis.find(e => e.name == "color_" + this.name.toLowerCase().replace(/ /g, "_"));
        };
        this.toString = function () {
            return this.hex;
        };
        if (this.isEmoji)
            Colors.push(this);
    };
};

module.exports = {
    Colors,

    Color,

    emoteGuild: "608760352456441872",
    miscLogs: "562328446445944872",
    modLogs: "575985149368467466",
    testingGuild: "608760352456441872",
    errorChannel: "614120959602982920",
    joinChannel: "562327921167958019",

    black: new Color('Black', '000000'),
    grey: new Color('Grey', 'C7C7C7'),
    moss: new Color('Moss', '2C452E'),
    brightGreen: new Color('Bright Green', '11A11D'),
    green: new Color('Green', '74B979'),
    neonGreen: new Color('Neon Green', '1DFF2D'),
    turquoise: new Color('Turquoise', '60D6AD'),
    aqua: new Color('Aqua', '94CECC'),
    cyan: new Color('Cyan', '2CE8E2'),
    teal: new Color('Teal', '23A09C'),
    skyBlue: new Color('Sky Blue', '76C7F2'),
    blue: new Color('Blue', '0490DA'),
    oceanBlue: new Color('Ocean Blue', '0671A9'),
    ultramarine: new Color('Ultramarine', '0C37DE'),
    darkPurple: new Color('Dark Purple', '7133CB'),
    periwinkle: new Color('Periwinkle', 'CCCCFF'),
    magenta: new Color('Magenta', '9212DE'),
    lightMagenta: new Color('Light Magenta', 'DAA2FC'),
    violet: new Color('Violet', 'E828FF'),
    beige: new Color('Beige', 'F6EFC8'),
    peach: new Color('Peach', 'E3CEDA'),
    pink: new Color('Pink', 'E699C5'),
    hotPink: new Color('Hot Pink', 'E56FB3'),
    neonPink: new Color('Neon Pink', 'FF0093'),
    red: new Color('Red', 'FC4B4B'),
    redder: new Color('Redder', 'FF0000'),
    darkOrange: new Color('Dark Orange', '9D4D25'),
    perfectOrange: new Color('Perfect Orange', 'FF7D00'),
    brightOrange: new Color('Bright Orange', 'FF9'),
    orange: new Color('Orange', 'FFDFAB'),
    yellow: new Color('Yellow', 'D8C100'),
    brightYellow: new Color('Bright Yellow', 'FFE400'),
    platinum: new Color('Platinum', 'E5E4E2', false),


    botInfo: {
        name: `TropBot ${config.useBeta ? '(Beta)' : ''}`,
        version: `3.0.0${config.useBeta ? 'b' : ''}`,
        developers: [
            '214298654863917059', //Caltrop#0001
            '152041181704880128' //The ._.dministrator#9187
        ]
    },
};