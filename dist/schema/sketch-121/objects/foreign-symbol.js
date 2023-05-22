"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const layer_1 = require("./layer");
const object_id_1 = require("./object-id");
exports.ForeignSymbolCodec = io_ts_1.type({
    do_objectID: object_id_1.ObjectIDCodec,
    originalMaster: layer_1.LayerCodec,
    symbolMaster: layer_1.LayerCodec,
}, 'ForeignSymbol');
