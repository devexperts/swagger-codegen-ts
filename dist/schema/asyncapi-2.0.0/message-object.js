"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reference_object_1 = require("./reference-object");
const correlation_id_object_1 = require("./correlation-id-object");
const tags_object_1 = require("./tags-object");
const external_documentation_object_1 = require("./external-documentation-object");
const message_trait_object_1 = require("./message-trait-object");
const schema_object_1 = require("./schema-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.MessageObjectCodec = io_ts_1.type({
    headers: optionFromNullable_1.optionFromNullable(schema_object_1.ObjectSchemaObjectCodec),
    payload: io_ts_1.union([reference_object_1.ReferenceObjectCodec, schema_object_1.SchemaObjectCodec]),
    correlationId: optionFromNullable_1.optionFromNullable(io_ts_1.union([reference_object_1.ReferenceObjectCodec, correlation_id_object_1.CorrelationIdObjectCodec])),
    schemaFormat: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    contentType: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    name: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    title: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    summary: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    tags: optionFromNullable_1.optionFromNullable(tags_object_1.TagsObjectCodec),
    externalDocs: optionFromNullable_1.optionFromNullable(external_documentation_object_1.ExternalDocumentationObjectCodec),
    examples: optionFromNullable_1.optionFromNullable(io_ts_1.array(io_ts_1.record(io_ts_1.string, io_ts_1.unknown))),
    traits: optionFromNullable_1.optionFromNullable(io_ts_1.array(message_trait_object_1.MessageTraitObjectCodec)),
}, 'MessageObject');
