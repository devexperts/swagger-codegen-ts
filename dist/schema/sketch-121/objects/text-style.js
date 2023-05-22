"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const text_vertical_alignment_1 = require("../enums/text-vertical-alignment");
const font_descriptor_1 = require("./font-descriptor");
const paragraph_style_1 = require("./paragraph-style");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const underline_style_1 = require("../enums/underline-style");
const text_transform_1 = require("../enums/text-transform");
const color_1 = require("./color");
exports.TextStyleCodec = io_ts_1.type({
    verticalAlignment: text_vertical_alignment_1.TextVerticalAlignmentCodec,
    encodedAttributes: io_ts_1.type({
        paragraphStyle: optionFromNullable_1.optionFromNullable(paragraph_style_1.ParagraphStyleCodec),
        MSAttributedStringTextTransformAttribute: optionFromNullable_1.optionFromNullable(text_transform_1.TextTransformCodec),
        underlineStyle: optionFromNullable_1.optionFromNullable(underline_style_1.UnderlineStyleCodec),
        kerning: optionFromNullable_1.optionFromNullable(io_ts_1.number),
        MSAttributedStringFontAttribute: font_descriptor_1.FontDescriptorCodec,
        MSAttributedStringColorAttribute: optionFromNullable_1.optionFromNullable(color_1.ColorCodec),
    }),
}, 'TextStyle');
