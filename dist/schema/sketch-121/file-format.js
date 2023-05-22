"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meta_1 = require("./meta");
const user_1 = require("./user");
const io_ts_1 = require("io-ts");
const document_1 = require("./document");
exports.FileFormatCodec = io_ts_1.type({
    document: document_1.DocumentCodec,
    meta: meta_1.MetaCodec,
    user: user_1.UserCodec,
});
