"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
exports.MetaCodec = io_ts_1.type({
    version: io_ts_1.union([io_ts_1.literal(121), io_ts_1.literal(122), io_ts_1.literal(123)]),
}, 'Meta');
