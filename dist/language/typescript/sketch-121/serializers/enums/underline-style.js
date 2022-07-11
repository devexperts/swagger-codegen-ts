"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeUnderlineStyle = (style) => {
    switch (style) {
        case 'None': {
            return 'normal';
        }
        case 'Underlined': {
            return 'underline';
        }
    }
};
