"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_item_object_1 = require("./channel-item-object");
const io_ts_1 = require("io-ts");
exports.ChannelsObjectCodec = io_ts_1.record(io_ts_1.string, channel_item_object_1.ChannelItemObjectCodec, 'ChannelsObject');
