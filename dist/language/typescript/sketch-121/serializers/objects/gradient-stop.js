"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
const io_ts_1 = require("../../../../../utils/io-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
exports.serializeGradientStop = (stop) => {
    const color = color_1.serializeColor(stop.color);
    const positionInPercents = io_ts_1.percentageFromFraction(stop.position);
    return either_utils_1.combineEither(positionInPercents, position => `${color} ${position}%`);
};
