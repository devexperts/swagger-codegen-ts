"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../common/utils");
const style_1 = require("./style");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const utils_2 = require("../../utils");
exports.serializeSharedStyle = reader_utils_1.combineReader(utils_2.context, context => (sharedStyle, jsdoc) => {
    const style = style_1.serializeStyle(sharedStyle.value);
    const safeName = context.nameStorage.getSafeName(sharedStyle.do_objectID, sharedStyle.name);
    return either_utils_1.combineEither(style, style => `
				${utils_1.getJSDoc([...(jsdoc || []), sharedStyle.name, sharedStyle.do_objectID])}
				export const ${safeName}: Partial<CSSStyleDeclaration> = {
					${style}
				};
			`);
});
