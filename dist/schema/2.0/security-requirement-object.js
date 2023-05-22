"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.SecurityRequirementObject = io_ts_1.dictionary(io_ts_2.array(io_ts_2.string), 'SecurityRequirementObject');
