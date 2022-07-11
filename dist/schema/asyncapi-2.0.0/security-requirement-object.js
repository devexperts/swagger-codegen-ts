"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
exports.SecurityRequirementObjectCodec = io_ts_1.record(io_ts_1.string, io_ts_1.string, 'SecurityRequirementObject');
