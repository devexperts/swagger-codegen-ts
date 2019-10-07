export interface Dictionary<A> extends Readonly<Record<string, A>> {}

export const serializeDictionary = <A, B>(
	dictionary: Dictionary<A>,
	serializeValue: (name: string, value: A) => B,
): B[] => Object.keys(dictionary).map(name => serializeValue(name, dictionary[name]));
