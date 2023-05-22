"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const items_object_1 = require("./items-object");
const io_ts_1 = require("../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.HeaderObject = io_ts_2.intersection([
    items_object_1.ItemsObjectCodec,
    io_ts_2.type({
        description: io_ts_1.stringOption,
    }),
], 'HeaderObject');
