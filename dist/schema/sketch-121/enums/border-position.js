"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.BorderPositionCodec = io_ts_2.union([io_ts_1.mapper('Center', 0), io_ts_1.mapper('Inside', 1), io_ts_1.mapper('Outside', 2)], 'BorderPosition');
