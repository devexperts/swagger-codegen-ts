"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websockets_channel_binding_object_1 = require("./websockets-channel-binding-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.ChannelBindingsObjectCodec = io_ts_1.type({
    ws: optionFromNullable_1.optionFromNullable(websockets_channel_binding_object_1.WebsocketsChannelBindingObjectCodec),
}, 'ChannelBindingsObject');
