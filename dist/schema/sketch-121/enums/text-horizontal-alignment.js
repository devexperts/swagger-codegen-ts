"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.TextHorizontalAlignmentCodec = io_ts_2.union([io_ts_1.mapper('Left', 0), io_ts_1.mapper('Right', 1), io_ts_1.mapper('Centered', 2), io_ts_1.mapper('Justified', 3), io_ts_1.mapper('Natural', 4)], 'TextHorizontalAlignment');
