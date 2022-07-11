"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const document_1 = require("./document");
const fs_1 = require("../../../../utils/fs");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
exports.serializeFileFormat = reader_utils_1.combineReader(document_1.serializeDocument, serializeDocument => (fileFormat) => {
    const document = serializeDocument(fileFormat.document);
    return either_utils_1.combineEither(document, document => pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(fp_ts_1.array.compact([document])), fp_ts_1.option.map(fs_1.fragment)));
});
