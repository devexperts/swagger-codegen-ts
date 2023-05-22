"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const reference_object_1 = require("./reference-object");
const schema_object_1 = require("./schema-object");
const media_type_object_1 = require("./media-type-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const BaseParameterObjectCodecProps = {
    name: io_ts_1.string,
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    deprecated: optionFromNullable_1.optionFromNullable(io_ts_1.boolean),
    schema: optionFromNullable_1.optionFromNullable(io_ts_1.union([reference_object_1.ReferenceObjectCodec, schema_object_1.SchemaObjectCodec])),
    content: optionFromNullable_1.optionFromNullable(io_ts_1.record(io_ts_1.string, media_type_object_1.MediaTypeObjectCodec)),
    explode: optionFromNullable_1.optionFromNullable(io_ts_1.boolean),
    style: optionFromNullable_1.optionFromNullable(io_ts_1.union([
        io_ts_1.literal('matrix'),
        io_ts_1.literal('label'),
        io_ts_1.literal('form'),
        io_ts_1.literal('simple'),
        io_ts_1.literal('spaceDelimited'),
        io_ts_1.literal('pipeDelimited'),
        io_ts_1.literal('deepObject'),
    ])),
};
const PathParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseParameterObjectCodecProps), { in: io_ts_1.literal('path'), required: io_ts_1.literal(true) }), 'PathParameterObject');
const HeaderParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseParameterObjectCodecProps), { in: io_ts_1.literal('header'), required: optionFromNullable_1.optionFromNullable(io_ts_1.boolean) }), 'HeaderParameterObject');
const QueryParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseParameterObjectCodecProps), { in: io_ts_1.literal('query'), required: optionFromNullable_1.optionFromNullable(io_ts_1.boolean) }), 'QueryParameterObject');
const CookieParameterObjectCodec = io_ts_1.type(Object.assign(Object.assign({}, BaseParameterObjectCodecProps), { in: io_ts_1.literal('cookie'), required: optionFromNullable_1.optionFromNullable(io_ts_1.boolean) }), 'CookieParameterObject');
exports.ParameterObjectCodec = io_ts_1.union([PathParameterObjectCodec, HeaderParameterObjectCodec, QueryParameterObjectCodec, CookieParameterObjectCodec], 'ParameterObject');
