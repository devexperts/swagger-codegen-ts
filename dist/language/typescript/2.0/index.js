"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../common/utils");
const fs_1 = require("../../../utils/fs");
const fp_ts_1 = require("fp-ts");
const pipeable_1 = require("fp-ts/lib/pipeable");
const swagger_object_1 = require("./serializers/swagger-object");
const prettier_1 = require("prettier");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
exports.serialize = reader_utils_1.combineReader(swagger_object_1.serializeSwaggerObject, serializeSwaggerObject => (documents, options = {}) => pipeable_1.pipe(documents, fp_ts_1.record.collect(serializeSwaggerObject), either_utils_1.sequenceEither, fp_ts_1.either.map(serialized => fs_1.map(fs_1.fragment(serialized), content => prettier_1.format(content, options.prettierConfig || utils_1.defaultPrettierConfig)))));
