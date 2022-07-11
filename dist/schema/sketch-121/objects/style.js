"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const fill_1 = require("./fill");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const graphics_context_settings_1 = require("./graphics-context-settings");
const border_1 = require("./border");
const border_options_1 = require("./border-options");
const inner_shadow_1 = require("./inner-shadow");
const shadow_1 = require("./shadow");
const text_style_1 = require("./text-style");
const object_id_1 = require("./object-id");
exports.StyleCodec = io_ts_1.type({
    do_objectID: object_id_1.ObjectIDCodec,
    borders: optionFromNullable_1.optionFromNullable(io_ts_1.array(border_1.BorderCodec)),
    borderOptions: border_options_1.BorderOptionsCodec,
    fills: optionFromNullable_1.optionFromNullable(io_ts_1.array(fill_1.FillCodec)),
    textStyle: optionFromNullable_1.optionFromNullable(text_style_1.TextStyleCodec),
    shadows: optionFromNullable_1.optionFromNullable(io_ts_1.array(shadow_1.ShadowCodec)),
    innerShadows: io_ts_1.array(inner_shadow_1.InnerShadowCodec),
    contextSettings: optionFromNullable_1.optionFromNullable(graphics_context_settings_1.GraphicsContextSettingsCodec),
}, 'Style');
