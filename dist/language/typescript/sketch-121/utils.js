"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Reader_1 = require("fp-ts/lib/Reader");
const utils_1 = require("../common/utils");
exports.createNameStorage = () => {
    const nameToUuid = new Map();
    const uuidToName = new Map();
    const nameToCounter = new Map();
    const getSafeNameWithCounter = (safeName) => {
        const counter = nameToCounter.get(safeName) || 1;
        const nameWithCounter = safeName + counter;
        nameToCounter.set(safeName, counter + 1);
        return !nameToUuid.has(nameWithCounter) ? nameWithCounter : getSafeNameWithCounter(safeName);
    };
    const getSafeName = (uuid, name) => {
        const safeName = utils_1.getSafePropertyName(name);
        // check if we have a name for such uuid
        const storedName = uuidToName.get(uuid);
        if (storedName !== undefined) {
            return storedName;
        }
        // no name - generate one
        // check if we have such name
        if (!nameToUuid.has(safeName)) {
            // no collisions
            nameToUuid.set(safeName, uuid);
            uuidToName.set(uuid, safeName);
            nameToCounter.set(safeName, 0);
            return safeName;
        }
        // we already have such safeName stored - increase counter and store under uuid
        const nameWithCounter = getSafeNameWithCounter(safeName);
        nameToUuid.set(nameWithCounter, uuid);
        uuidToName.set(uuid, nameWithCounter);
        return nameWithCounter;
    };
    return {
        getSafeName,
    };
};
exports.context = Reader_1.ask();
