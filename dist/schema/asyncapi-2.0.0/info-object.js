"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_object_1 = require("./contact-object");
const license_object_1 = require("./license-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.InfoObjectCodec = io_ts_1.type({
    title: io_ts_1.string,
    version: io_ts_1.string,
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    termsOfService: optionFromNullable_1.optionFromNullable(io_ts_1.string),
    contact: optionFromNullable_1.optionFromNullable(contact_object_1.ContactObjectCodec),
    license: optionFromNullable_1.optionFromNullable(license_object_1.LicenseObjectCodec),
}, 'InfoObject');
