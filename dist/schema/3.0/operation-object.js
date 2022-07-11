"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const reference_object_1 = require("./reference-object");
const parameter_object_1 = require("./parameter-object");
const request_body_object_1 = require("./request-body-object");
const responses_object_1 = require("./responses-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.OperationObjectCodec = io_ts_1.type({
    tags: optionFromNullable_1.optionFromNullable(io_ts_1.array(io_ts_1.string)),
    summary: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    operationId: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    parameters: optionFromNullable_1.optionFromNullable(io_ts_1.array(io_ts_1.union([reference_object_1.ReferenceObjectCodec, parameter_object_1.ParameterObjectCodec]))),
    requestBody: optionFromNullable_1.optionFromNullable(io_ts_1.union([reference_object_1.ReferenceObjectCodec, request_body_object_1.RequestBodyObjectCodec])),
    responses: responses_object_1.ResponsesObjectCodec,
    deprecated: optionFromNullable_1.optionFromNullable(io_ts_1.boolean),
}, 'OperationObject');
