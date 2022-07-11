"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gradient_stop_1 = require("./gradient-stop");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const serializeGradientStops = (stops) => pipeable_1.pipe(stops.map(gradient_stop_1.serializeGradientStop), either_utils_1.sequenceEither, fp_ts_1.either.map(stops => stops.join(', ')));
const serializeLinearGradient = (gradient) => {
    const angle = getAngle(gradient.from, gradient.to);
    const stops = serializeGradientStops(gradient.stops);
    return either_utils_1.combineEither(stops, stops => `linear-gradient(${angle}deg, ${stops})`);
};
const serializeRadialGradient = (gradient) => {
    const stops = serializeGradientStops(gradient.stops);
    return either_utils_1.combineEither(stops, stops => `radial-gradient(${stops})`);
};
const serializeConicGradient = (gradient) => {
    const stops = serializeGradientStops(gradient.stops);
    return either_utils_1.combineEither(stops, stops => `conic-gradient(${stops})`);
};
exports.serializeGradient = (gradient) => {
    switch (gradient.gradientType) {
        case 0: {
            return serializeLinearGradient(gradient);
        }
        case 1: {
            return serializeRadialGradient(gradient);
        }
        case 2: {
            return serializeConicGradient(gradient);
        }
    }
};
const getAngle = (start, end) => 90 - (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
