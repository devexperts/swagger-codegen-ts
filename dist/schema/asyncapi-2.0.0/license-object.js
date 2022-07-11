"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.LicenseObjectCodec = io_ts_1.type({
    name: io_ts_1.string,
    url: optionFromNullable_1.optionFromNullable(io_ts_1.string),
}, 'LicenseObject');
