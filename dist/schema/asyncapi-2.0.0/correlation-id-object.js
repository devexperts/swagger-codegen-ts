"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.CorrelationIdObjectCodec = io_ts_1.type({
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    location: io_ts_1.string,
}, 'CorrelationIdObject');
