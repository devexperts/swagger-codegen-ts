"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
exports.FontDescriptorCodec = io_ts_1.type({
    attributes: io_ts_1.type({
        name: io_ts_1.string,
        size: io_ts_1.number,
    }),
});
