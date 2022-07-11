"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const media_type_object_1 = require("./media-type-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.RequestBodyObjectCodec = io_ts_1.type({
    content: io_ts_1.record(io_ts_1.string, media_type_object_1.MediaTypeObjectCodec),
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    required: optionFromNullable_1.optionFromNullable(io_ts_1.boolean),
}, 'RequestBodyObject');
