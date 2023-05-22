"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_type_1 = require("../../common/data/serialized-type");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const Either_1 = require("fp-ts/lib/Either");
const Option_1 = require("fp-ts/lib/Option");
exports.serializeItemsObject = (from, itemsObject) => {
    switch (itemsObject.type) {
        case 'array': {
            return pipeable_1.pipe(exports.serializeItemsObject(from, itemsObject.items), fp_ts_1.either.map(serialized_type_1.getSerializedArrayType(Option_1.none)));
        }
        case 'string': {
            return serialized_type_1.getSerializedStringType(from, itemsObject.format);
        }
        case 'number': {
            return Either_1.right(serialized_type_1.SERIALIZED_NUMBER_TYPE);
        }
        case 'integer': {
            return Either_1.right(serialized_type_1.SERIALIZED_INTEGER_TYPE);
        }
        case 'boolean': {
            return Either_1.right(serialized_type_1.SERIALIZED_BOOLEAN_TYPE);
        }
    }
};
