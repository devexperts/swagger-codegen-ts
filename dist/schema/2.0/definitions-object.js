"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_object_1 = require("./schema-object");
const io_ts_1 = require("../../utils/io-ts");
exports.DefinitionsObject = io_ts_1.dictionary(schema_object_1.SchemaObjectCodec, 'DefinitionsObject');
