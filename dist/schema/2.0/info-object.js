"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("../../utils/io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const contact_object_1 = require("./contact-object");
const license_object_1 = require("./license-object");
const io_ts_2 = require("io-ts");
exports.InfoObject = io_ts_2.type({
    title: io_ts_2.string,
    description: io_ts_1.stringOption,
    termsOfService: io_ts_1.stringOption,
    contact: optionFromNullable_1.optionFromNullable(contact_object_1.ContactObject),
    license: optionFromNullable_1.optionFromNullable(license_object_1.LicenseObject),
    version: io_ts_2.string,
}, 'InfoObject');
