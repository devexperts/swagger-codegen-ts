"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blend_mode_1 = require("../enums/blend-mode");
const io_ts_1 = require("io-ts");
exports.GraphicsContextSettingsCodec = io_ts_1.type({
    blendMode: blend_mode_1.BlendModeCodec,
    opacity: io_ts_1.number,
}, 'GraphicsContextSettings');
