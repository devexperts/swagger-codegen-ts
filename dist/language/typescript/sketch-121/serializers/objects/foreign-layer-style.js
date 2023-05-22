"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const shared_style_1 = require("./shared-style");
exports.serializeForeignLayerStyle = reader_utils_1.combineReader(shared_style_1.serializeSharedStyle, serializeSharedStyle => (style) => serializeSharedStyle(style.localSharedStyle, [style.sourceLibraryName]));
