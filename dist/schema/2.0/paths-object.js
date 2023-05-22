"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_item_object_1 = require("./path-item-object");
const io_ts_1 = require("../../utils/io-ts");
exports.PathsObject = io_ts_1.dictionary(path_item_object_1.PathItemObjectCodec, 'PathsObject');
