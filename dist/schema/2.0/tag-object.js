"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const external_documentation_object_1 = require("./external-documentation-object");
const io_ts_1 = require("../../utils/io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const io_ts_2 = require("io-ts");
exports.TagObject = io_ts_2.type({
    name: io_ts_2.string,
    description: io_ts_1.stringOption,
    externalDocs: optionFromNullable_1.optionFromNullable(external_documentation_object_1.ExternalDocumentationObject),
}, 'TagObject');
