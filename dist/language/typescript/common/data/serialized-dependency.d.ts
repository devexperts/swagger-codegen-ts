import { Kind } from '../../../../utils/types';
import { Eq } from 'fp-ts/lib/Eq';
import { ord } from 'fp-ts';
export interface SerializedDependency {
    readonly name: string;
    readonly path: string;
}
export declare const serializedDependency: (name: string, path: string) => SerializedDependency;
export declare const serializeDependencies: (dependencies: SerializedDependency[]) => string;
export declare const ordDependencyByPath: ord.Ord<SerializedDependency>;
export declare const ordDependencyByName: ord.Ord<SerializedDependency>;
export declare const monoidDependencies: import("fp-ts/lib/Monoid").Monoid<SerializedDependency[]>;
export declare const OPTION_DEPENDENCIES: SerializedDependency[];
export declare const LITERAL_DEPENDENCY: SerializedDependency;
export declare const eqSerializedDependency: Eq<SerializedDependency>;
export declare const uniqSerializedDependencies: (as: SerializedDependency[]) => SerializedDependency[];
export declare const getSerializedKindDependency: (kind: Kind) => SerializedDependency;
