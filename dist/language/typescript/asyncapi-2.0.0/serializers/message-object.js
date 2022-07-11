"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = require("../../../../utils/ref");
const serialized_type_1 = require("../../common/data/serialized-type");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const reference_object_1 = require("../../../../schema/asyncapi-2.0.0/reference-object");
const schema_object_1 = require("./schema-object");
exports.serializeMessageObject = (from, messageObject) => reference_object_1.ReferenceObjectCodec.is(messageObject.payload)
    ? pipeable_1.pipe(ref_1.fromString(messageObject.payload.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
    : schema_object_1.serializeSchemaObject(from, messageObject.payload);
