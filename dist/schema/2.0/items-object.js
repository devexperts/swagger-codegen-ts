"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../utils/io-ts");
const io_ts_2 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const BaseItemsObjectProps = {
    format: io_ts_1.stringOption,
    collectionFormat: optionFromNullable_1.optionFromNullable(io_ts_2.union([io_ts_2.literal('csv'), io_ts_2.literal('ssv'), io_ts_2.literal('tsv'), io_ts_2.literal('pipes')])),
    maximum: io_ts_1.numberOption,
    exclusiveMaximum: io_ts_1.booleanOption,
    minimum: io_ts_1.numberOption,
    exclusiveMinimum: io_ts_1.booleanOption,
    maxLength: io_ts_1.numberOption,
    minLength: io_ts_1.numberOption,
    pattern: io_ts_1.stringOption,
    maxItems: io_ts_1.numberOption,
    minItems: io_ts_1.numberOption,
    uniqueItems: io_ts_1.booleanOption,
    enum: io_ts_1.primitiveArrayOption,
    multipleOf: io_ts_1.numberOption,
};
const ArrayItemsObjectCodec = io_ts_2.recursion('ArrayItemsObject', () => io_ts_2.type(Object.assign(Object.assign({}, BaseItemsObjectProps), { type: io_ts_2.literal('array'), items: exports.ItemsObjectCodec, collectionFormat: optionFromNullable_1.optionFromNullable(io_ts_2.union([io_ts_2.literal('csv'), io_ts_2.literal('ssv'), io_ts_2.literal('tsv'), io_ts_2.literal('pipes')])) })));
const NonArrayItemsObjectCodec = io_ts_2.type(Object.assign(Object.assign({}, BaseItemsObjectProps), { type: io_ts_2.union([io_ts_2.literal('string'), io_ts_2.literal('number'), io_ts_2.literal('integer'), io_ts_2.literal('boolean')]) }));
exports.ItemsObjectCodec = io_ts_2.recursion('ItemsObject', () => io_ts_2.union([ArrayItemsObjectCodec, NonArrayItemsObjectCodec]));
