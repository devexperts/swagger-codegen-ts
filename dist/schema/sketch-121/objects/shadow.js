"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const color_1 = require("./color");
exports.ShadowCodec = io_ts_1.type({
    isEnabled: io_ts_1.boolean,
    blurRadius: io_ts_1.number,
    color: color_1.ColorCodec,
    offsetX: io_ts_1.number,
    offsetY: io_ts_1.number,
    spread: io_ts_1.number,
}, 'Shadow');
