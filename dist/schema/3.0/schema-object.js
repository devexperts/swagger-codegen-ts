"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const reference_object_1 = require("./reference-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const io_ts_2 = require("../../utils/io-ts");
const nonEmptyArray_1 = require("io-ts-types/lib/nonEmptyArray");
const BaseSchemaObjectCodec = io_ts_1.type({
    format: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    deprecated: optionFromNullable_1.optionFromNullable(io_ts_1.boolean),
    nullable: optionFromNullable_1.optionFromNullable(io_ts_1.boolean),
    maxItems: io_ts_2.numberOption,
    minItems: io_ts_2.numberOption,
});
exports.EnumSchemaObjectCodec = io_ts_1.intersection([
    BaseSchemaObjectCodec,
    io_ts_1.type({
        enum: nonEmptyArray_1.nonEmptyArray(io_ts_2.JSONPrimitiveCodec),
    }),
], 'EnumSchemaObject');
exports.PrimitiveSchemaObjectCodec = io_ts_1.intersection([
    BaseSchemaObjectCodec,
    io_ts_1.type({
        format: optionFromNullable_1.optionFromNullable(io_ts_1.string),
        type: io_ts_1.union([io_ts_1.literal('boolean'), io_ts_1.literal('string'), io_ts_1.literal('number'), io_ts_1.literal('integer')]),
    }),
], 'PrimitiveSchemaObject');
exports.ObjectSchemaObjectCodec = io_ts_1.recursion('ObjectSchemaObject', () => io_ts_1.intersection([
    BaseSchemaObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('object'),
        properties: optionFromNullable_1.optionFromNullable(io_ts_1.record(io_ts_1.string, io_ts_1.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec]))),
        additionalProperties: optionFromNullable_1.optionFromNullable(io_ts_1.union([io_ts_1.boolean, reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec])),
        required: optionFromNullable_1.optionFromNullable(io_ts_1.array(io_ts_1.string)),
    }),
]));
exports.ArraySchemaObjectCodec = io_ts_1.recursion('ArraySchemaObject', () => io_ts_1.intersection([
    BaseSchemaObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('array'),
        items: io_ts_1.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec]),
    }),
]));
exports.AllOfSchemaObjectCodec = io_ts_1.recursion('AllOfSchemaObject', () => io_ts_1.intersection([
    BaseSchemaObjectCodec,
    io_ts_1.type({
        allOf: nonEmptyArray_1.nonEmptyArray(io_ts_1.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec])),
    }),
]));
exports.OneOfSchemaObjectCodec = io_ts_1.recursion('OneOfSchemaObject', () => io_ts_1.intersection([
    BaseSchemaObjectCodec,
    io_ts_1.type({
        oneOf: nonEmptyArray_1.nonEmptyArray(io_ts_1.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec])),
    }),
]));
exports.SchemaObjectCodec = io_ts_1.recursion('SchemaObject', () => io_ts_1.union([
    exports.EnumSchemaObjectCodec,
    exports.PrimitiveSchemaObjectCodec,
    exports.ObjectSchemaObjectCodec,
    exports.ArraySchemaObjectCodec,
    exports.AllOfSchemaObjectCodec,
    exports.OneOfSchemaObjectCodec,
]));
