"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const abstract_document_1 = require("./abstract-document");
const page_1 = require("./objects/page");
exports.DocumentCodec = io_ts_1.intersection([
    abstract_document_1.AbstractDocumentCodec,
    io_ts_1.type({
        pages: io_ts_1.array(page_1.PageCodec),
    }),
], 'Document');
