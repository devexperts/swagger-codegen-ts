"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../utils/io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const reference_object_1 = require("./reference-object");
const io_ts_2 = require("io-ts");
const nonEmptyArray_1 = require("io-ts-types/lib/nonEmptyArray");
exports.BaseSchemaObjectCodec = io_ts_2.type({
    description: optionFromNullable_1.optionFromNullable(io_ts_2.string),
});
exports.EnumSchemaObjectCodec = io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        enum: nonEmptyArray_1.nonEmptyArray(io_ts_1.JSONPrimitiveCodec),
    }),
], 'EnumSchemaObject');
exports.PrimitiveSchemaObjectCodec = io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        format: optionFromNullable_1.optionFromNullable(io_ts_2.string),
        type: io_ts_2.union([
            io_ts_2.literal('null'),
            io_ts_2.literal('string'),
            io_ts_2.literal('number'),
            io_ts_2.literal('integer'),
            io_ts_2.literal('boolean'),
        ]),
    }),
], 'PrimitiveSchemaObject');
exports.AllOfSchemaObject = io_ts_2.recursion('ReferenceOrAllOfSchemaObject', () => io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        allOf: nonEmptyArray_1.nonEmptyArray(io_ts_2.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec])),
    }),
]));
exports.ArraySchemaObjectCodec = io_ts_2.recursion('ArraySchemaObject', () => io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        type: io_ts_2.literal('array'),
        items: exports.SchemaObjectCodec,
    }),
]));
const ObjectSchemaObjectCodec = io_ts_2.recursion('ObjectSchemaObject', () => io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        required: io_ts_1.stringArrayOption,
        type: io_ts_2.literal('object'),
        properties: optionFromNullable_1.optionFromNullable(io_ts_1.dictionary(exports.SchemaObjectCodec, 'Dictionary<SchemaObject>')),
        additionalProperties: optionFromNullable_1.optionFromNullable(exports.SchemaObjectCodec),
    }),
]));
exports.SchemaObjectCodec = io_ts_2.recursion('SchemaObject', () => io_ts_2.union([
    reference_object_1.ReferenceObjectCodec,
    exports.EnumSchemaObjectCodec,
    exports.PrimitiveSchemaObjectCodec,
    exports.AllOfSchemaObject,
    ObjectSchemaObjectCodec,
    exports.ArraySchemaObjectCodec,
]));
