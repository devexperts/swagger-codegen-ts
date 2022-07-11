"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_variable_object_1 = require("./server-variable-object");
const security_requirement_object_1 = require("./security-requirement-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.ServerObjectCodec = io_ts_1.type({
    url: io_ts_1.string,
    protocol: io_ts_1.string,
    protocolVersion: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    variables: optionFromNullable_1.optionFromNullable(io_ts_1.record(io_ts_1.string, server_variable_object_1.ServerVariableObjectCodec)),
    security: optionFromNullable_1.optionFromNullable(io_ts_1.array(security_requirement_object_1.SecurityRequirementObjectCodec)),
}, 'ServerObject');
