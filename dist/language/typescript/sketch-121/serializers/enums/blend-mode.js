"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("fp-ts/lib/Either");
exports.getBackgroundBlendMode = (mode) => {
    const invalid = Either_1.left(new Error(`Unsupported BlendMode for background-blend-mode: "${mode}"`));
    switch (mode) {
        case 'Normal':
            return Either_1.right('normal');
        case 'Darken':
            return Either_1.right('darken');
        case 'Multiply':
            return Either_1.right('multiply');
        case 'Color burn':
            return invalid;
        case 'Lighten':
            return Either_1.right('lighten');
        case 'Screen':
            return Either_1.right('screen');
        case 'Color dodge':
            return Either_1.right('color-dodge');
        case 'Overlay':
            return Either_1.right('overlay');
        case 'Soft light':
            return invalid;
        case 'Hard light':
            return invalid;
        case 'Difference':
            return invalid;
        case 'Exclusion':
            return invalid;
        case 'Hue':
            return invalid;
        case 'Saturation':
            return Either_1.right('saturation');
        case 'Color':
            return Either_1.right('color');
        case 'Luminosity':
            return Either_1.right('luminosity');
        case 'Plus darker':
            return invalid;
        case 'Plus lighter':
            return invalid;
    }
};
exports.getMixBlendMode = (mode) => {
    const invalid = Either_1.left(new Error(`Unsupported BlendMode for mix-blend-mode: "${mode}"`));
    switch (mode) {
        case 'Normal':
            return Either_1.right('normal');
        case 'Darken':
            return Either_1.right('darken');
        case 'Multiply':
            return Either_1.right('multiply');
        case 'Color burn':
            return Either_1.right('color-burn');
        case 'Lighten':
            return Either_1.right('lighten');
        case 'Screen':
            return Either_1.right('screen');
        case 'Color dodge':
            return Either_1.right('color-dodge');
        case 'Overlay':
            return Either_1.right('overlay');
        case 'Soft light':
            return invalid;
        case 'Hard light':
            return invalid;
        case 'Difference':
            return Either_1.right('difference');
        case 'Exclusion':
            return Either_1.right('exclusion');
        case 'Hue':
            return Either_1.right('hue');
        case 'Saturation':
            return Either_1.right('saturation');
        case 'Color':
            return Either_1.right('color');
        case 'Luminosity':
            return Either_1.right('luminosity');
        case 'Plus darker':
            return invalid;
        case 'Plus lighter':
            return invalid;
    }
};
