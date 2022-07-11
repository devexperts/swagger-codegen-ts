"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
const unit_interval_1 = require("../utils/unit-interval");
const io_ts_1 = require("io-ts");
exports.GradientStopCodec = io_ts_1.type({
    color: color_1.ColorCodec,
    position: unit_interval_1.UnitIntervalCodec,
}, 'GradientStopCodec');
