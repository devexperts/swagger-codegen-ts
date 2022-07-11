"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.ExternalDocumentationObject = io_ts_2.type({
    description: io_ts_1.stringOption,
    url: io_ts_2.string,
}, 'ExternalDocumentationObject');
