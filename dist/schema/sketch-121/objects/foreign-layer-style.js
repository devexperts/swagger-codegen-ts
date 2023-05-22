"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const shared_style_1 = require("./shared-style");
exports.ForeignLayerStyleCodec = io_ts_1.type({
    sourceLibraryName: io_ts_1.string,
    localSharedStyle: shared_style_1.SharedStyleCodec,
}, 'ForeignLayerStyle');
