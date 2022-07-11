"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gradient_type_1 = require("../enums/gradient-type");
const io_ts_1 = require("io-ts");
const point_string_1 = require("../utils/point-string");
const gradient_stop_1 = require("./gradient-stop");
exports.GradientCodec = io_ts_1.type({
    gradientType: gradient_type_1.GradientTypeCodec,
    from: point_string_1.PointStringCodec,
    to: point_string_1.PointStringCodec,
    stops: io_ts_1.array(gradient_stop_1.GradientStopCodec),
}, 'Gradient');
