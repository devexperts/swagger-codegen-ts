"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const NumberFromString_1 = require("io-ts-types/lib/NumberFromString");
const pointString = io_ts_1.type({
    x: io_ts_1.number,
    y: io_ts_1.number,
});
const pattern = /^{(\S+), (\S+)}$/;
exports.PointStringCodec = new io_ts_1.Type('PointString', (u) => pointString.is(u), (u, c) => pipeable_1.pipe(io_ts_1.string.validate(u, c), fp_ts_1.either.chain(s => {
    const match = s.match(pattern);
    if (!match) {
        return io_ts_1.failure(u, c);
    }
    const x = pipeable_1.pipe(fp_ts_1.array.lookup(1, match), fp_ts_1.option.fold(() => io_ts_1.failure(u, c), x => NumberFromString_1.NumberFromString.validate(x, c)));
    const y = pipeable_1.pipe(fp_ts_1.array.lookup(2, match), fp_ts_1.option.fold(() => io_ts_1.failure(u, c), y => NumberFromString_1.NumberFromString.validate(y, c)));
    return either_utils_1.combineEither(x, y, (x, y) => ({ x, y }));
})), p => `{${p.x}, ${p.y}}`);
