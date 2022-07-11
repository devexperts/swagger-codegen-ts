"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const io_ts_2 = require("../../../utils/io-ts");
exports.UnitIntervalCodec = io_ts_1.brand(io_ts_2.fraction, (n) => n >= 0 && n <= 1, 'UnitInterval');
