"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const reference_object_1 = require("./reference-object");
const schema_object_1 = require("./schema-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const parameter_object_1 = require("./parameter-object");
const response_object_1 = require("./response-object");
const request_body_object_1 = require("./request-body-object");
exports.ComponentsObjectCodec = io_ts_1.type({
    schemas: optionFromNullable_1.optionFromNullable(io_ts_1.record(io_ts_1.string, io_ts_1.union([reference_object_1.ReferenceObjectCodec, schema_object_1.SchemaObjectCodec]))),
    parameters: optionFromNullable_1.optionFromNullable(io_ts_1.record(io_ts_1.string, io_ts_1.union([reference_object_1.ReferenceObjectCodec, parameter_object_1.ParameterObjectCodec]))),
    responses: optionFromNullable_1.optionFromNullable(io_ts_1.record(io_ts_1.string, io_ts_1.union([reference_object_1.ReferenceObjectCodec, response_object_1.ResponseObjectCodec]))),
    requestBodies: optionFromNullable_1.optionFromNullable(io_ts_1.record(io_ts_1.string, io_ts_1.union([reference_object_1.ReferenceObjectCodec, request_body_object_1.RequestBodyObjectCodec]))),
}, 'ComponentsObject');
