"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const header_object_1 = require("./header-object");
const io_ts_1 = require("../../utils/io-ts");
exports.HeadersObject = io_ts_1.dictionary(header_object_1.HeaderObject, 'HeadersObject');
