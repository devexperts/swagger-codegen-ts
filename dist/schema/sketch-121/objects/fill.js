"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const color_1 = require("./color");
const gradient_1 = require("./gradient");
const fill_type_1 = require("../enums/fill-type");
const graphics_context_settings_1 = require("./graphics-context-settings");
exports.FillCodec = io_ts_1.type({
    isEnabled: io_ts_1.boolean,
    color: color_1.ColorCodec,
    fillType: fill_type_1.FillTypeCodec,
    contextSettings: graphics_context_settings_1.GraphicsContextSettingsCodec,
    gradient: gradient_1.GradientCodec,
}, 'Fill');
