"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_horizontal_alignment_1 = require("../enums/text-horizontal-alignment");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.ParagraphStyleCodec = io_ts_1.type({
    alignment: optionFromNullable_1.optionFromNullable(text_horizontal_alignment_1.TextHorizontalAlignmentCodec),
    maximumLineHeight: optionFromNullable_1.optionFromNullable(io_ts_1.number),
    minimumLineHeight: optionFromNullable_1.optionFromNullable(io_ts_1.number),
});
