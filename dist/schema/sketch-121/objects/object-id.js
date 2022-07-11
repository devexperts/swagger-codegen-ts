"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const UUIDReg = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
const ObjectIDReg = new RegExp(`${UUIDReg.source}(\\[${UUIDReg.source}\\])?`, 'i');
exports.ObjectIDCodec = io_ts_1.brand(io_ts_1.string, (n) => ObjectIDReg.test(n), 'ObjectID');
