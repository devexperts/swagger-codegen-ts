"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const reference_object_1 = require("./reference-object");
const parameter_object_1 = require("./parameter-object");
const pattern = /^[A-Za-z0-9_\-]+$/;
const ParametersObjectFieldPatternCodec = io_ts_1.brand(io_ts_1.string, (v) => pattern.test(v), 'ParametersObjectFieldPattern');
exports.ParametersObjectCodec = io_ts_1.record(ParametersObjectFieldPatternCodec, io_ts_1.union([reference_object_1.ReferenceObjectCodec, parameter_object_1.ParameterObjectCodec]), 'ParametersObject');
