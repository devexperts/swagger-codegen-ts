"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gradient_1 = require("./gradient");
const io_ts_1 = require("io-ts");
const object_id_1 = require("./object-id");
exports.GradientAssetCodec = io_ts_1.type({
    do_objectID: object_id_1.ObjectIDCodec,
    name: io_ts_1.string,
    gradient: gradient_1.GradientCodec,
});
