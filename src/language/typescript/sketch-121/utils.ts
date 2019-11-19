import { ask } from 'fp-ts/lib/Reader';

export interface NameStorage {
	readonly get: (uid: string, name: string) => string;
}

export const createNameStorage = () => {
	// const bind = memoize()
	const nameToUuid = new Map<string, string>();
	const uuidToName = new Map<string, string>();
	const nameToCounter = new Map<string, number>();
	return {
		get(uuid: string, name: string): string {
			// check if we have a name for such uuid
			const storedName = uuidToName.get(uuid);
			if (storedName !== undefined) {
				return storedName;
			}
			// no name - generate one
			// check if we have such name
			if (!nameToUuid.has(name)) {
				// no collisions
				nameToUuid.set(name, uuid);
				uuidToName.set(uuid, name);
				nameToCounter.set(name, 0);
				return name;
			}
			// we already have such name stored - increase counter and store under uuid
			const counter = nameToCounter.get(name) || 1;
			const nameWithCounter = name + counter;
			nameToUuid.set(nameWithCounter, uuid);
			uuidToName.set(uuid, nameWithCounter);
			nameToCounter.set(name, counter + 1);
			return nameWithCounter;
		},
	};
};

export interface Context {
	readonly nameStorage: NameStorage;
	// readonly resolvePage: (ref: PageFileRef) => Either<Error, unkn>
}
export const context = ask<Context>();
