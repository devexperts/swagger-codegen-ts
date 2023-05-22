"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const utils_1 = require("../common/utils");
const fs_1 = require("../../../utils/fs");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const prettier_1 = require("prettier");
const asyncapi_object_1 = require("./serializers/asyncapi-object");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
exports.serialize = reader_utils_1.combineReader(asyncapi_object_1.serializeAsyncAPIObject, serializeAsyncAPIObject => (documents, options = {}) => pipeable_1.pipe(documents, fp_ts_1.record.collect(serializeAsyncAPIObject), either_utils_1.sequenceEither, fp_ts_1.either.map(e => fs_1.map(fs_1.fragment(e), content => prettier_1.format(content, options.prettierConfig || utils_1.defaultPrettierConfig)))));
