"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const style_1 = require("./style");
const object_id_1 = require("./object-id");
exports.SharedStyleCodec = io_ts_1.type({
    name: io_ts_1.string,
    do_objectID: object_id_1.ObjectIDCodec,
    value: style_1.StyleCodec,
}, 'SharedStyle');
