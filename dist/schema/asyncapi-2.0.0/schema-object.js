"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../utils/io-ts");
const io_ts_2 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const reference_object_1 = require("./reference-object");
const Ord_1 = require("fp-ts/lib/Ord");
const nonEmptyArray_1 = require("io-ts-types/lib/nonEmptyArray");
const external_documentation_object_1 = require("./external-documentation-object");
exports.BaseSchemaObjectCodec = io_ts_2.type({
    externalDocs: optionFromNullable_1.optionFromNullable(external_documentation_object_1.ExternalDocumentationObjectCodec),
    deprecated: optionFromNullable_1.optionFromNullable(io_ts_2.boolean),
}, 'BaseSchemaObject');
exports.EnumSchemaObjectCodec = io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        enum: nonEmptyArray_1.nonEmptyArray(io_ts_1.JSONPrimitiveCodec),
    }),
], 'EnumSchemaObject');
exports.ConstSchemaObjectCodec = io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        const: io_ts_1.JSONPrimitiveCodec,
    }),
], 'ConstSchemaObject');
exports.AllOfSchemaObjectCodec = io_ts_2.recursion('AllOfSchemaObject', () => io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        allOf: nonEmptyArray_1.nonEmptyArray(io_ts_2.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec])),
    }),
]));
exports.OneOfSchemaObjectCodec = io_ts_2.recursion('OneOfSchemaObject', () => io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        oneOf: nonEmptyArray_1.nonEmptyArray(io_ts_2.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec])),
    }),
]));
exports.BasePrimitiveSchemaObjectCodec = io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        format: optionFromNullable_1.optionFromNullable(io_ts_2.string),
    }),
], 'BasePrimitiveSchemaObject');
const NullSchemaObjectCodec = io_ts_2.intersection([
    exports.BasePrimitiveSchemaObjectCodec,
    io_ts_2.type({
        type: io_ts_2.literal('null'),
    }),
], 'NullSchemaObject');
const BooleanSchemaObjectCodec = io_ts_2.intersection([
    exports.BasePrimitiveSchemaObjectCodec,
    io_ts_2.type({
        type: io_ts_2.literal('boolean'),
    }),
], 'BooleanSchemaObject');
const BaseNumericSchemaObjectCodec = io_ts_2.intersection([
    exports.BasePrimitiveSchemaObjectCodec,
    io_ts_2.type({
        multipleOf: optionFromNullable_1.optionFromNullable(io_ts_1.positive),
        maximum: optionFromNullable_1.optionFromNullable(io_ts_2.number),
        exclusiveMaximum: optionFromNullable_1.optionFromNullable(io_ts_2.number),
        minimum: optionFromNullable_1.optionFromNullable(io_ts_2.number),
        exclusiveMinimum: optionFromNullable_1.optionFromNullable(io_ts_2.number),
    }),
], 'BaseNumericSchemaObject');
const NumberSchemaObjectCodec = io_ts_2.intersection([
    BaseNumericSchemaObjectCodec,
    io_ts_2.type({
        type: io_ts_2.literal('number'),
    }),
], 'NumberSchemaObject');
const IntegerSchemaObjectCodec = io_ts_2.intersection([
    BaseNumericSchemaObjectCodec,
    io_ts_2.type({
        type: io_ts_2.literal('integer'),
    }),
], 'IntegerSchemaObject');
const StringSchemaObjectCodec = io_ts_2.intersection([
    exports.BasePrimitiveSchemaObjectCodec,
    io_ts_2.type({
        type: io_ts_2.literal('string'),
        maxLength: optionFromNullable_1.optionFromNullable(io_ts_1.natural),
        minLength: optionFromNullable_1.optionFromNullable(io_ts_1.natural),
        pattern: optionFromNullable_1.optionFromNullable(io_ts_2.string),
    }),
], 'StringSchemaObject');
const ArraySchemaObjectCodec = io_ts_2.recursion('ArraySchemaObject', () => io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        type: io_ts_2.literal('array'),
        items: io_ts_2.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec]),
        maxItems: optionFromNullable_1.optionFromNullable(io_ts_1.natural),
        minItems: optionFromNullable_1.optionFromNullable(io_ts_1.natural),
    }),
]));
exports.ObjectSchemaObjectCodec = io_ts_2.recursion('ObjectSchemaObject', () => io_ts_2.intersection([
    exports.BaseSchemaObjectCodec,
    io_ts_2.type({
        type: io_ts_2.literal('object'),
        properties: optionFromNullable_1.optionFromNullable(io_ts_2.record(io_ts_2.string, io_ts_2.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec]))),
        additionalProperties: optionFromNullable_1.optionFromNullable(io_ts_2.union([reference_object_1.ReferenceObjectCodec, exports.SchemaObjectCodec])),
        required: optionFromNullable_1.optionFromNullable(io_ts_1.nonEmptySetFromArray(io_ts_2.string, Ord_1.ordString)),
    }),
]));
exports.SchemaObjectCodec = io_ts_2.recursion('SchemaObject', () => io_ts_2.union([
    exports.EnumSchemaObjectCodec,
    exports.ConstSchemaObjectCodec,
    exports.AllOfSchemaObjectCodec,
    exports.OneOfSchemaObjectCodec,
    NullSchemaObjectCodec,
    BooleanSchemaObjectCodec,
    NumberSchemaObjectCodec,
    IntegerSchemaObjectCodec,
    StringSchemaObjectCodec,
    ArraySchemaObjectCodec,
    exports.ObjectSchemaObjectCodec,
]));
