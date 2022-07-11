"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const media_type_object_1 = require("./media-type-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.ResponseObjectCodec = io_ts_1.type({
    description: io_ts_1.string,
    content: optionFromNullable_1.optionFromNullable(io_ts_1.record(io_ts_1.string, media_type_object_1.MediaTypeObjectCodec)),
}, 'ResponseObject');
