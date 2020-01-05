import { ask } from 'fp-ts/lib/Reader';
import { getSafePropertyName } from '../common/utils';

export interface NameStorage {
	readonly getSafeName: (uuid: string, name: string) => string;
}

export const createNameStorage = () => {
	const nameToUuid = new Map<string, string>();
	const uuidToName = new Map<string, string>();
	const nameToCounter = new Map<string, number>();

	const getSafeNameWithCounter = (safeName: string): string => {
		const counter = nameToCounter.get(safeName) || 1;
		const nameWithCounter = safeName + counter;
		nameToCounter.set(safeName, counter + 1);
		return !nameToUuid.has(nameWithCounter) ? nameWithCounter : getSafeNameWithCounter(safeName);
	};

	const getSafeName = (uuid: string, name: string): string => {
		const safeName = getSafePropertyName(name);
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

export interface Context {
	readonly nameStorage: NameStorage;
}
export const context = ask<Context>();
