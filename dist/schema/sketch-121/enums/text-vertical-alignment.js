"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.TextVerticalAlignmentCodec = io_ts_2.union([io_ts_1.mapper('Top', 0), io_ts_1.mapper('Middle', 1), io_ts_1.mapper('Bottom', 2)], 'TextVerticalAlignment');
