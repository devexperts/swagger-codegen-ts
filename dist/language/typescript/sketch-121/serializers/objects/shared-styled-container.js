"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeable_1 = require("fp-ts/lib/pipeable");
const shared_style_1 = require("./shared-style");
const fp_ts_1 = require("fp-ts");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const either_1 = require("../../../../../utils/either");
const option_1 = require("../../../../../utils/option");
exports.serializeSharedStyleContainer = reader_utils_1.combineReader(shared_style_1.serializeSharedStyle, serializeSharedStyle => (sharedStyleContainer) => pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(sharedStyleContainer.objects), fp_ts_1.option.map(objects => pipeable_1.pipe(either_1.traverseNEAEither(objects, serializeSharedStyle), fp_ts_1.either.map(styles => styles.join('')))), option_1.sequenceOptionEither));
