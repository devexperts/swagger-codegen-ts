"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
const io_ts_1 = require("io-ts");
exports.InnerShadowCodec = io_ts_1.type({
    isEnabled: io_ts_1.boolean,
    blurRadius: io_ts_1.number,
    color: color_1.ColorCodec,
    offsetX: io_ts_1.number,
    offsetY: io_ts_1.number,
    spread: io_ts_1.number,
}, 'InnerShadow');
