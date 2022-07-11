"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const t = require("io-ts");
const io_ts_1 = require("io-ts");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const setFromArray_1 = require("io-ts-types/lib/setFromArray");
exports.stringOption = optionFromNullable_1.optionFromNullable(t.string);
exports.booleanOption = optionFromNullable_1.optionFromNullable(t.boolean);
exports.numberOption = optionFromNullable_1.optionFromNullable(t.number);
exports.stringArrayOption = optionFromNullable_1.optionFromNullable(t.array(t.string));
exports.primitiveArrayOption = optionFromNullable_1.optionFromNullable(t.array(t.union([t.string, t.boolean, t.number])));
exports.dictionary = (codec, name) => io_ts_1.record(io_ts_1.string, codec, name);
exports.reportIfFailed = (validation) => pipeable_1.pipe(validation, fp_ts_1.either.mapLeft(e => pipeable_1.pipe(fp_ts_1.array.last(e), fp_ts_1.option.fold(() => new Error('Validation failure should contain at least one error'), e => new Error(getMessage(e))))));
function getMessage(e) {
    return e.message !== undefined
        ? e.message
        : createMessage(e.context) + '\n in context: \n' + getContextPath(e.context);
}
function createMessage(context) {
    return ('\n Received: \n  ' +
        JSON.stringify(context[context.length - 1].actual) +
        '\n expected: \n  ' +
        context[context.length - 1].type.name +
        '\n in field \n  ' +
        context[context.length - 1].key);
}
function getContextPath(context) {
    return context
        .map(function (cEntry, index) {
        const padding = new Array(index * 2 + 2).fill(' ').join('');
        return (padding + cEntry.key + (index > 0 ? ': ' : '') + cEntry.type.name.replace(/([,{])/g, '$1 \n' + padding));
    })
        .join(' -> \n');
}
exports.integer = io_ts_1.brand(io_ts_1.number, (n) => n !== -Infinity && n !== Infinity && Math.floor(n) === n, 'Integer');
exports.nonNegative = io_ts_1.brand(io_ts_1.number, (n) => n >= 0.0, 'NonNegative');
exports.positive = io_ts_1.brand(io_ts_1.number, (n) => n > 0.0, 'Positive');
exports.natural = io_ts_1.intersection([exports.nonNegative, exports.integer], 'Natural');
exports.nonEmptySetFromArray = (codec, ord) => io_ts_1.brand(setFromArray_1.setFromArray(codec, ord), (s) => s.size > 0, 'NonEmptySet');
exports.JSONPrimitiveCodec = io_ts_1.union([io_ts_1.string, io_ts_1.number, io_ts_1.boolean, io_ts_1.null]);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.fraction = io_ts_1.brand(io_ts_1.number, (n) => true, 'Fraction');
exports.fractionFromPercentage = (a) => exports.reportIfFailed(exports.fraction.decode(a / 100));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.percentage = io_ts_1.brand(io_ts_1.number, (n) => true, 'Percentage');
exports.percentageFromFraction = (a) => exports.reportIfFailed(exports.percentage.decode(a * 100));
exports.mapper = (decoded, encoded, name = `${decoded} <-> ${encoded}`) => new io_ts_1.Type(name, (u) => u === decoded, (u, c) => (u === encoded ? io_ts_1.success(decoded) : io_ts_1.failure(u, c)), () => encoded);
