"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeDictionary = (dictionary, serializeValue) => Object.keys(dictionary).map(name => serializeValue(name, dictionary[name]));
exports.foldKind = (value, hkt, kind, kind2) => {
    switch (value) {
        case 'HKT': {
            return hkt;
        }
        case '*': {
            return kind;
        }
        case '* -> *': {
            return kind2;
        }
    }
};
