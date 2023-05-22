"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeTextVerticalAlignment = (alignment) => {
    switch (alignment) {
        case 'Top': {
            return 'top';
        }
        case 'Middle': {
            return 'middle';
        }
        case 'Bottom': {
            return 'bottom';
        }
    }
};
