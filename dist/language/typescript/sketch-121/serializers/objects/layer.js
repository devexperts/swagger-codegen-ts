"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../common/utils");
const style_1 = require("./style");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const utils_2 = require("../../utils");
const fp_ts_1 = require("fp-ts");
const pipeable_1 = require("fp-ts/lib/pipeable");
const either_1 = require("../../../../../utils/either");
const function_1 = require("fp-ts/lib/function");
exports.serializeLayer = reader_utils_1.combineReader(utils_2.context, context => (layer, jsdoc) => {
    const layerNameWithPrefix = `layer_${layer.name}`;
    const safeName = context.nameStorage.getSafeName(layer.do_objectID, layerNameWithPrefix);
    const layerStyle = style_1.serializeStyle(layer.style);
    const nestedLayersStyles = either_1.traverseOptionEither(layer.layers, layers => pipeable_1.pipe(either_1.traverseArrayEither(layers, exports.serializeLayer(context)), fp_ts_1.either.map(styles => styles.join(''))));
    return either_utils_1.combineEither(layerStyle, nestedLayersStyles, (pageStyle, nestedPagesStyles) => `
            ${utils_1.getJSDoc([...(jsdoc || []), utils_1.escapeCommpent(layer.name), layer.do_objectID])}
            export const ${safeName}:  { name: string; styles: Partial<CSSStyleDeclaration> } = {
                name: '${layer.name}',
                styles: {
                    ${pageStyle}
                },
            };
            ${fp_ts_1.option.fold(function_1.constant(''), function_1.identity)(nestedPagesStyles)}
        `);
});
