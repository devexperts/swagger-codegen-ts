"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_object_1 = require("./schema-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.WebsocketsChannelBindingObjectCodec = io_ts_1.type({
    method: optionFromNullable_1.optionFromNullable(io_ts_1.union([io_ts_1.literal('GET'), io_ts_1.literal('POST')])),
    query: optionFromNullable_1.optionFromNullable(schema_object_1.ObjectSchemaObjectCodec),
    headers: optionFromNullable_1.optionFromNullable(schema_object_1.ObjectSchemaObjectCodec),
    bindingVersion: optionFromNullable_1.optionFromNullable(io_ts_1.string),
}, 'WebsocketsChannelBindingObject');
