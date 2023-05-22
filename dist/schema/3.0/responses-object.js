"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const response_object_1 = require("./response-object");
const reference_object_1 = require("./reference-object");
exports.ResponsesObjectCodec = io_ts_1.record(io_ts_1.string, io_ts_1.union([reference_object_1.ReferenceObjectCodec, response_object_1.ResponseObjectCodec]), 'ResponsesObject');
