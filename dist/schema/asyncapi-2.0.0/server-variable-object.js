"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.ServerVariableObjectCodec = io_ts_1.type({
    enum: optionFromNullable_1.optionFromNullable(io_ts_1.array(io_ts_1.string)),
    default: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    examples: optionFromNullable_1.optionFromNullable(io_ts_1.array(io_ts_1.string)),
}, 'ServerVariableObject');
