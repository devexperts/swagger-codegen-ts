"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
exports.OverrideValueCodec = io_ts_1.type({
    _class: io_ts_1.string,
    value: io_ts_1.string,
    overrideName: io_ts_1.string,
}, 'OverrideValue');
