"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unless = (condition, a) => (condition ? '' : a);
exports.when = (condition, a) => (condition ? a : '');
exports.before = (symbol) => (path) => {
    const index = path.indexOf(symbol);
    if (index >= 0) {
        return path.substr(0, index);
    }
    return path;
};
exports.trim = (s) => s.trim();
exports.split = (symbol) => (s) => s.split(symbol);
