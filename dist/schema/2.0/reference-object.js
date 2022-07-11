"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
exports.ReferenceObjectCodec = io_ts_1.type({
    $ref: io_ts_1.string,
}, 'ReferenceObject');
