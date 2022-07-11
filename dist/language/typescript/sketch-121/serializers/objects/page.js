"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_ts_1 = require("fp-ts");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const pipeable_1 = require("fp-ts/lib/pipeable");
const layer_1 = require("./layer");
const either_1 = require("../../../../../utils/either");
exports.serializePage = reader_utils_1.combineReader(layer_1.serializeLayer, serializeLayer => (page) => pipeable_1.pipe(either_1.traverseArrayEither(page.layers, serializeLayer), fp_ts_1.either.map(styles => styles.join(''))));
