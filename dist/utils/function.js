"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTo = (...args) => (f) => f(...args);
exports.trace = (...args) => (a) => {
    console.log(...args, a);
    return a;
};
