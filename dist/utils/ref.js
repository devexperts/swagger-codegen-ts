"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Array_1 = require("fp-ts/lib/Array");
const NonEmptyArray_1 = require("fp-ts/lib/NonEmptyArray");
const Either_1 = require("fp-ts/lib/Either");
const Eq_1 = require("fp-ts/lib/Eq");
const fp_ts_1 = require("fp-ts");
const Ord_1 = require("fp-ts/lib/Ord");
exports.ordRefByPath = fp_ts_1.ord.contramap((ref) => ref.path)(Ord_1.ordString);
exports.eqRef = Eq_1.getStructEq({
    $ref: Eq_1.eqString,
    name: Eq_1.eqString,
    path: Eq_1.eqString,
    target: Eq_1.eqString,
});
exports.uniqRefs = Array_1.uniq(exports.eqRef);
exports.fromString = ($ref) => {
    let target = '';
    let inPath = false;
    let pathPart = '';
    const parts = [];
    const invalid = Either_1.left(new Error(`Invalid ref "${$ref}"`));
    if ($ref.length === 0) {
        return invalid;
    }
    for (const symbol of $ref) {
        switch (symbol) {
            case '#': {
                if (inPath) {
                    return invalid;
                }
                inPath = true;
                break;
            }
            case '/': {
                if (!inPath) {
                    target += '/';
                }
                else if (pathPart === '') {
                    pathPart = '/';
                }
                else if (pathPart === '/') {
                    pathPart = '/';
                }
                else {
                    parts.push(pathPart);
                    pathPart = '/';
                }
                break;
            }
            default: {
                if (!inPath) {
                    target += symbol;
                }
                else if (pathPart === '') {
                    return invalid;
                }
                else {
                    pathPart += symbol;
                }
                break;
            }
        }
    }
    if (pathPart !== '' && pathPart !== '/') {
        parts.push(pathPart);
    }
    if (!Array_1.isNonEmpty(parts)) {
        return invalid;
    }
    const name = NonEmptyArray_1.last(parts).slice(1); //skip leading '/'
    const path = parts.join('');
    return Either_1.right({
        $ref,
        name,
        path,
        target,
    });
};
exports.addPathParts = (...parts) => (ref) => exports.fromString(`${ref.$ref}/${parts.join('/')}`);
exports.getRelativePath = (from, to) => {
    const toSelf = path.relative(path.dirname(from.path), '/');
    const toRoot = to.target === '' ? toSelf : path.join('..', toSelf);
    const joined = path.join(toRoot, to.target, to.path);
    const joinedWithProperSeparator = path.sep === path.posix.sep ? joined : joined.split(path.sep).join(path.posix.sep);
    return joinedWithProperSeparator.startsWith('..') ? joinedWithProperSeparator : `./${joinedWithProperSeparator}`;
};
exports.getFullPath = (ref) => path.join(ref.target, ref.path);
