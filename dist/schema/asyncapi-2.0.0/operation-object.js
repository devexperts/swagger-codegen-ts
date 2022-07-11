"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tags_object_1 = require("./tags-object");
const external_documentation_object_1 = require("./external-documentation-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const operation_trait_object_1 = require("./operation-trait-object");
const message_object_1 = require("./message-object");
const reference_object_1 = require("./reference-object");
const nonEmptyArray_1 = require("io-ts-types/lib/nonEmptyArray");
exports.OperationObjectOneOfMessageCodec = io_ts_1.type({
    oneOf: nonEmptyArray_1.nonEmptyArray(io_ts_1.union([reference_object_1.ReferenceObjectCodec, message_object_1.MessageObjectCodec])),
}, 'OperationObjectOneOfMessage');
exports.OperationObjectCodec = io_ts_1.type({
    operationId: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    summary: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    tags: optionFromNullable_1.optionFromNullable(tags_object_1.TagsObjectCodec),
    externalDocs: optionFromNullable_1.optionFromNullable(external_documentation_object_1.ExternalDocumentationObjectCodec),
    traits: optionFromNullable_1.optionFromNullable(io_ts_1.array(operation_trait_object_1.OperationTraitObjectCodec)),
    message: io_ts_1.union([reference_object_1.ReferenceObjectCodec, message_object_1.MessageObjectCodec, exports.OperationObjectOneOfMessageCodec]),
}, 'OperationObject');
