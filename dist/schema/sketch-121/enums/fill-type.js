"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.FillTypeCodec = io_ts_2.union([io_ts_1.mapper('Color', 0), io_ts_1.mapper('Gradient', 1), io_ts_1.mapper('Pattern', 2)], 'FillType');
