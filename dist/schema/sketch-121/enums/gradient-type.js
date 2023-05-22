"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
exports.GradientTypeCodec = io_ts_1.union([io_ts_1.literal(0, 'Linear'), io_ts_1.literal(1, 'Radial'), io_ts_1.literal(2, 'Angular')], 'GradientType');
