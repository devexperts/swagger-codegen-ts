"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialized_type_1 = require("../../common/data/serialized-type");
const pipeable_1 = require("fp-ts/lib/pipeable");
const schema_object_1 = require("./schema-object");
const Either_1 = require("fp-ts/lib/Either");
const fp_ts_1 = require("fp-ts");
exports.serializeResponseObject = (from, response) => pipeable_1.pipe(response.schema, fp_ts_1.option.fold(() => Either_1.right(serialized_type_1.SERIALIZED_VOID_TYPE), schema => schema_object_1.serializeSchemaObject(from, schema)));
