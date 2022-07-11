"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../../utils/io-ts");
const io_ts_2 = require("io-ts");
const color_1 = require("./color");
const fill_type_1 = require("../enums/fill-type");
const border_position_1 = require("../enums/border-position");
const graphics_context_settings_1 = require("./graphics-context-settings");
const gradient_1 = require("./gradient");
exports.BorderCodec = io_ts_2.type({
    isEnabled: io_ts_2.boolean,
    color: color_1.ColorCodec,
    fillType: fill_type_1.FillTypeCodec,
    position: border_position_1.BorderPositionCodec,
    thickness: io_ts_1.nonNegative,
    contextSettings: graphics_context_settings_1.GraphicsContextSettingsCodec,
    gradient: gradient_1.GradientCodec,
}, 'Border');
