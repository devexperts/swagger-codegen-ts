"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
exports.BorderOptionsCodec = io_ts_1.type({
    isEnabled: io_ts_1.boolean,
    dashPattern: io_ts_1.array(io_ts_1.number),
});
