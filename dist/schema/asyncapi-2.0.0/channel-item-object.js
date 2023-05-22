"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operation_object_1 = require("./operation-object");
const parameters_object_1 = require("./parameters-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const channel_bindings_object_1 = require("./channel-bindings-object");
exports.ChannelItemObjectCodec = io_ts_1.type({
    $ref: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    subscribe: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    publish: optionFromNullable_1.optionFromNullable(operation_object_1.OperationObjectCodec),
    parameters: optionFromNullable_1.optionFromNullable(parameters_object_1.ParametersObjectCodec),
    bindings: optionFromNullable_1.optionFromNullable(channel_bindings_object_1.ChannelBindingsObjectCodec),
}, 'ChannelItemObject');
