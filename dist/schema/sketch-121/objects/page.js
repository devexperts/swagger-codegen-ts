"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const style_1 = require("./style");
const object_id_1 = require("./object-id");
const io_ts_1 = require("io-ts");
const layer_1 = require("./layer");
exports.PageCodec = io_ts_1.type({
    do_objectID: object_id_1.ObjectIDCodec,
    name: io_ts_1.string,
    style: style_1.StyleCodec,
    layers: io_ts_1.array(layer_1.LayerCodec),
}, 'Page');
