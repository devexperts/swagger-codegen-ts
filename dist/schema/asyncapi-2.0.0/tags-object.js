"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_object_1 = require("./tag-object");
const io_ts_1 = require("io-ts");
exports.TagsObjectCodec = io_ts_1.array(tag_object_1.TagObjectCodec, 'TagsObject');
