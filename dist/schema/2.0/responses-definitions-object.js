"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_object_1 = require("./response-object");
const io_ts_1 = require("../../utils/io-ts");
exports.ResponsesDefinitionsObject = io_ts_1.dictionary(response_object_1.ResponseObject, 'ResponsesDefinitionsObject');
