"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const server_object_1 = require("./server-object");
const pattern = /^[A-Za-z0-9_\-]+$/;
const ServersObjectFieldPatternCodec = io_ts_1.brand(io_ts_1.string, (v) => pattern.test(v), 'ServersObjectFieldPattern');
exports.ServersObjectCodec = io_ts_1.record(ServersObjectFieldPatternCodec, server_object_1.ServerObjectCodec, 'ServersObject');
