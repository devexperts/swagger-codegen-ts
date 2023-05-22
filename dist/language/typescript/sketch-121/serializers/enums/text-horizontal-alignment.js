"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("fp-ts/lib/Either");
exports.serializeTextHorizontalAlignment = (alignment) => {
    switch (alignment) {
        case 'Centered': {
            return Either_1.right('center');
        }
        case 'Justified': {
            return Either_1.right('justify');
        }
        case 'Left': {
            return Either_1.right('left');
        }
        case 'Right': {
            return Either_1.right('right');
        }
        case 'Natural': {
            return Either_1.left(new Error('TextHorizontalAlignment.Natural is not supported'));
        }
    }
};
