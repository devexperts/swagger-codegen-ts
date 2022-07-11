"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const path_item_object_1 = require("./path-item-object");
exports.PathsObjectCodec = io_ts_1.record(io_ts_1.string, path_item_object_1.PathItemObjectCodec, 'PathsObject');
