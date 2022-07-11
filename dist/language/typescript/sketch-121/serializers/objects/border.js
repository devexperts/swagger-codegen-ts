"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("fp-ts/lib/Either");
const color_1 = require("./color");
const gradient_1 = require("./gradient");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
exports.serializeBorder = (border, borderOptions) => {
    const width = `${border.thickness}px`;
    const style = borderOptions.isEnabled && borderOptions.dashPattern.length > 0 ? 'dashed' : 'solid';
    switch (border.fillType) {
        case 'Color':
            const color = color_1.serializeColor(border.color);
            return Either_1.right(`border: '${style} ${width} ${color}'`);
        case 'Gradient':
            const gradient = gradient_1.serializeGradient(border.gradient);
            return pipeable_1.pipe(gradient, fp_ts_1.either.map(gradient => `
						borderStyle: '${style}',
						borderWidth: '${width}',
						borderImageSource: '${gradient}',
						borderImageSlice: '1'
					`));
        case 'Pattern': {
            return Either_1.left(new Error(`Border.fillType "Pattern" is not supported`));
        }
    }
};
