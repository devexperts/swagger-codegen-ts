"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.BlendModeCodec = io_ts_2.union([
    io_ts_1.mapper('Normal', 0),
    io_ts_1.mapper('Darken', 1),
    io_ts_1.mapper('Multiply', 2),
    io_ts_1.mapper('Color burn', 3),
    io_ts_1.mapper('Lighten', 4),
    io_ts_1.mapper('Screen', 5),
    io_ts_1.mapper('Color dodge', 6),
    io_ts_1.mapper('Overlay', 7),
    io_ts_1.mapper('Soft light', 8),
    io_ts_1.mapper('Hard light', 9),
    io_ts_1.mapper('Difference', 10),
    io_ts_1.mapper('Exclusion', 11),
    io_ts_1.mapper('Hue', 12),
    io_ts_1.mapper('Saturation', 13),
    io_ts_1.mapper('Color', 14),
    io_ts_1.mapper('Luminosity', 15),
    io_ts_1.mapper('Plus darker', 16),
    io_ts_1.mapper('Plus lighter', 17),
], 'BlendMode');
