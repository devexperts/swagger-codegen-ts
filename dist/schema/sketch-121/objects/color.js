"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unit_interval_1 = require("../utils/unit-interval");
const io_ts_1 = require("io-ts");
exports.ColorCodec = io_ts_1.type({
    alpha: unit_interval_1.UnitIntervalCodec,
    red: unit_interval_1.UnitIntervalCodec,
    green: unit_interval_1.UnitIntervalCodec,
    blue: unit_interval_1.UnitIntervalCodec,
}, 'Color');
