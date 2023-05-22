"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const example_object_1 = require("./example-object");
const headers_object_1 = require("./headers-object");
const schema_object_1 = require("./schema-object");
const io_ts_1 = require("io-ts");
exports.ResponseObject = io_ts_1.type({
    description: io_ts_1.string,
    schema: optionFromNullable_1.optionFromNullable(schema_object_1.SchemaObjectCodec),
    headers: optionFromNullable_1.optionFromNullable(headers_object_1.HeadersObject),
    examples: optionFromNullable_1.optionFromNullable(example_object_1.ExampleObject),
}, 'ResponseObject');
