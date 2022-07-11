"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_object_1 = require("./schema-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.ParameterObjectCodec = io_ts_1.type({
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    schema: optionFromNullable_1.optionFromNullable(schema_object_1.SchemaObjectCodec),
    location: optionFromNullable_1.optionFromNullable(io_ts_1.string),
}, 'ParameterObject');
