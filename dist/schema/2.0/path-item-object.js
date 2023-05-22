"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../utils/io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const operation_object_1 = require("./operation-object");
const parameter_object_1 = require("./parameter-object");
const reference_object_1 = require("./reference-object");
const io_ts_2 = require("io-ts");
exports.PathItemObjectCodec = io_ts_2.type({
    $ref: io_ts_1.stringOption,
    get: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObject),
    put: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObject),
    post: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObject),
    delete: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObject),
    options: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObject),
    head: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObject),
    patch: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObject),
    parameters: optionFromNullable_1.optionFromNullable(io_ts_2.array(io_ts_2.union([reference_object_1.ReferenceObjectCodec, parameter_object_1.ParameterObjectCodec]))),
}, 'PathItemObject');
