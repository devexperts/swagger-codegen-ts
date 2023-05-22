"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
const io_ts_1 = require("io-ts");
const object_id_1 = require("./object-id");
exports.ColorAssetCodec = io_ts_1.type({
    do_objectID: object_id_1.ObjectIDCodec,
    name: io_ts_1.string,
    color: color_1.ColorCodec,
}, 'ColorAsset');
