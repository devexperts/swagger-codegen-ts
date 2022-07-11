"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tags_object_1 = require("./tags-object");
const external_documentation_object_1 = require("./external-documentation-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.OperationTraitObjectCodec = io_ts_1.type({
    operationId: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    summary: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    tags: optionFromNullable_1.optionFromNullable(tags_object_1.TagsObjectCodec),
    externalDocs: optionFromNullable_1.optionFromNullable(external_documentation_object_1.ExternalDocumentationObjectCodec),
}, 'OperationTraitObject');
