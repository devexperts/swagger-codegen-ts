"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const shared_style_1 = require("./shared-style");
exports.SharedTextStyleContainerCodec = io_ts_1.type({
    objects: io_ts_1.array(shared_style_1.SharedStyleCodec),
}, 'SharedTextStyleContainer');
