"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const external_documentation_object_1 = require("./external-documentation-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.TagObjectCodec = io_ts_1.type({
    name: io_ts_1.string,
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    externalDocs: optionFromNullable_1.optionFromNullable(external_documentation_object_1.ExternalDocumentationObjectCodec),
}, 'TagObject');
