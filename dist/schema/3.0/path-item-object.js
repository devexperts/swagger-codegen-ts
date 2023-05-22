"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const operation_object_1 = require("./operation-object");
const server_object_1 = require("./server-object");
const reference_object_1 = require("./reference-object");
const parameter_object_1 = require("./parameter-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.PathItemObjectCodec = io_ts_1.type({
    $ref: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    summary: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    get: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    put: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    post: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    delete: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    options: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    head: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    patch: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    trace: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    servers: optionFromNullable_1.optionFromNullable(io_ts_1.array(server_object_1.ServerObjectCodec)),
    parameters: optionFromNullable_1.optionFromNullable(io_ts_1.array(io_ts_1.union([reference_object_1.ReferenceObjectCodec, parameter_object_1.ParameterObjectCodec]))),
}, 'PathItemObject');
