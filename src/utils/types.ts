export interface Dictionary<A> extends Readonly<Record<string, A>> {}

export const serializeDictionary = <A, B>(
	dictionary: Dictionary<A>,
	serializeValue: (name: string, value: A) => B,
): B[] => Object.keys(dictionary).map(name => serializeValue(name, dictionary[name]));

export type Kind = 'HKT' | '*' | '* -> *';

export const foldKind = <A>(value: Kind, hkt: A, kind: A, kind2: A): A => {
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
