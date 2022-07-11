"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const schema_object_1 = require("./schema-object");
const items_object_1 = require("./items-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const BaseParameterObjectProps = {
    required: optionFromNullable_1.optionFromNullable(io_ts_1.boolean),
    name: io_ts_1.string,
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
};
const BaseArrayParameterObjectProps = {
    type: io_ts_1.literal('array'),
    items: items_object_1.ItemsObjectCodec,
    collectionFormat: optionFromNullable_1.optionFromNullable(io_ts_1.union([io_ts_1.literal('csv'), io_ts_1.literal('ssv'), io_ts_1.literal('tsv'), io_ts_1.literal('pipes'), io_ts_1.literal('multi')])),
};
const BaseNonArrayParameterObjectProps = {
    type: io_ts_1.union([io_ts_1.literal('string'), io_ts_1.literal('number'), io_ts_1.literal('integer'), io_ts_1.literal('boolean')]),
    format: optionFromNullable_1.optionFromNullable(io_ts_1.string),
};
const BodyParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseParameterObjectProps), { in: io_ts_1.literal('body'), schema: schema_object_1.SchemaObjectCodec }), 'BodyParameterObject');
const BaseFormDataParameterObjectProps = Object.assign(Object.assign({}, BaseParameterObjectProps), { in: io_ts_1.literal('formData') });
const ArrayFormDataParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseFormDataParameterObjectProps), BaseArrayParameterObjectProps));
const NonArrayFormDataParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign(Object.assign({}, BaseFormDataParameterObjectProps), BaseNonArrayParameterObjectProps), { type: io_ts_1.union([io_ts_1.literal('string'), io_ts_1.literal('number'), io_ts_1.literal('integer'), io_ts_1.literal('boolean'), io_ts_1.literal('file')]) }));
const FormDataParameterObjectCodec = io_ts_1.union([
    ArrayFormDataParameterObjectCodec,
    NonArrayFormDataParameterObjectCodec,
]);
const BaseQueryParameterObjectProps = Object.assign(Object.assign({}, BaseParameterObjectProps), { in: io_ts_1.literal('query') });
exports.ArrayQueryParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseQueryParameterObjectProps), BaseArrayParameterObjectProps));
const NonArrayQueryHeaderPathParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseQueryParameterObjectProps), BaseNonArrayParameterObjectProps));
const QueryParameterObjectCodec = io_ts_1.union([
    exports.ArrayQueryParameterObjectCodec,
    NonArrayQueryHeaderPathParameterObjectCodec,
]);
const BasePathParameterObjectProps = Object.assign(Object.assign({}, BaseParameterObjectProps), { in: io_ts_1.literal('path'), required: io_ts_1.literal(true) });
const ArrayPathParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BasePathParameterObjectProps), BaseArrayParameterObjectProps));
const NonArrayPathParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BasePathParameterObjectProps), BaseNonArrayParameterObjectProps));
const PathParameterObjectCodec = io_ts_1.union([
    ArrayPathParameterObjectCodec,
    NonArrayPathParameterObjectCodec,
]);
const BaseHeaderParameterObjectProps = Object.assign(Object.assign({}, BaseParameterObjectProps), { in: io_ts_1.literal('header') });
const ArrayHeaderParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseHeaderParameterObjectProps), BaseArrayParameterObjectProps));
const NonArrayHeaderParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseHeaderParameterObjectProps), BaseNonArrayParameterObjectProps));
const HeaderParameterObjectCodec = io_ts_1.union([
    ArrayHeaderParameterObjectCodec,
    NonArrayHeaderParameterObjectCodec,
]);
exports.ParameterObjectCodec = io_ts_1.union([
    BodyParameterObjectCodec,
    FormDataParameterObjectCodec,
    QueryParameterObjectCodec,
    PathParameterObjectCodec,
    HeaderParameterObjectCodec,
], 'ParameterObject');
