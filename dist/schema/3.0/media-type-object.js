"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const schema_object_1 = require("./schema-object");
const reference_object_1 = require("./reference-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.MediaTypeObjectCodec = io_ts_1.type({
    schema: optionFromNullable_1.optionFromNullable(io_ts_1.union([reference_object_1.ReferenceObjectCodec, schema_object_1.SchemaObjectCodec])),
}, 'MediaTypeObject');
