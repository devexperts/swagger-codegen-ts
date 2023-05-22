"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_object_1 = require("./response-object");
const io_ts_1 = require("../../utils/io-ts");
const reference_object_1 = require("./reference-object");
const io_ts_2 = require("io-ts");
exports.ResponsesObject = io_ts_1.dictionary(io_ts_2.union([reference_object_1.ReferenceObjectCodec, response_object_1.ResponseObject]), 'ResponsesObject');
