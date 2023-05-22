"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../utils/io-ts");
const io_ts_2 = require("io-ts");
exports.ContactObject = io_ts_2.type({
    name: io_ts_1.stringOption,
    url: io_ts_1.stringOption,
    email: io_ts_1.stringOption,
}, 'ContactObject');
