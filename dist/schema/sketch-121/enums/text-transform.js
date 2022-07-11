"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.TextTransformCodec = io_ts_2.union([io_ts_1.mapper('None', 0), io_ts_1.mapper('Uppercase', 1), io_ts_1.mapper('Lowercase', 2)], 'TextTransform');
