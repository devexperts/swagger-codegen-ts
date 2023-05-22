"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
exports.LayerClassCodec = io_ts_1.union([
    io_ts_1.literal('symbolInstance'),
    io_ts_1.literal('symbolMaster'),
    io_ts_1.literal('group'),
    io_ts_1.literal('oval'),
    io_ts_1.literal('text'),
    io_ts_1.literal('rectangle'),
    io_ts_1.literal('shapePath'),
    io_ts_1.literal('shapeGroup'),
    io_ts_1.literal('artboard'),
], 'LayerClass');
