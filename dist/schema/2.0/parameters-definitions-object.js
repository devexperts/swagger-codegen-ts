"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameter_object_1 = require("./parameter-object");
const io_ts_1 = require("../../utils/io-ts");
exports.ParametersDefinitionsObject = io_ts_1.dictionary(parameter_object_1.ParameterObjectCodec, 'ParametersDefinitionsObject');
