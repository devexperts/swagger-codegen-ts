export interface Dictionary<A> extends Readonly<Record<string, A>> {
}
export declare const serializeDictionary: <A, B>(dictionary: Dictionary<A>, serializeValue: (name: string, value: A) => B) => B[];
export declare type Kind = 'HKT' | '*' | '* -> *';
export declare const foldKind: <A>(value: Kind, hkt: A, kind: A, kind2: A) => A;
