import { SerializedDependency } from './serialized-dependency';
import { Monoid } from 'fp-ts/lib/Monoid';
import { Ref } from '../../../../utils/ref';
export interface SerializedFragment {
    readonly value: string;
    readonly dependencies: SerializedDependency[];
    readonly refs: Ref[];
}
export declare const serializedFragment: (value: string, dependencies: SerializedDependency[], refs: Ref<string>[]) => SerializedFragment;
export declare const monoidSerializedFragment: Monoid<SerializedFragment>;
export declare const intercalateSerializedFragmentsNEA: (sep: SerializedFragment, fm: import("fp-ts/lib/NonEmptyArray").NonEmptyArray<SerializedFragment>) => SerializedFragment;
export declare const intercalateSerializedFragments: (sep: SerializedFragment, fm: SerializedFragment[]) => SerializedFragment;
export declare const foldSerializedFragments: (as: SerializedFragment[]) => SerializedFragment;
export declare function combineFragments(a: SerializedFragment, p: (a: string) => string): SerializedFragment;
export declare function combineFragments(a: SerializedFragment, b: SerializedFragment, p: (a: string, b: string) => string): SerializedFragment;
export declare function combineFragments(a: SerializedFragment, b: SerializedFragment, c: SerializedFragment, p: (a: string, b: string, c: string) => string): SerializedFragment;
export declare function combineFragments(a: SerializedFragment, b: SerializedFragment, c: SerializedFragment, d: SerializedFragment, p: (a: string, b: string, c: string, d: string) => string): SerializedFragment;
export declare function combineFragments(a: SerializedFragment, b: SerializedFragment, c: SerializedFragment, d: SerializedFragment, e: SerializedFragment, p: (a: string, b: string, c: string, d: string, e: string) => string): SerializedFragment;
export declare function combineFragments(a: SerializedFragment, b: SerializedFragment, c: SerializedFragment, d: SerializedFragment, e: SerializedFragment, f: SerializedFragment, p: (a: string, b: string, c: string, d: string, e: string, f: string) => string): SerializedFragment;
export declare function combineFragmentsK(a: SerializedFragment, p: (a: string) => SerializedFragment): SerializedFragment;
export declare function combineFragmentsK(a: SerializedFragment, b: SerializedFragment, p: (a: string, b: string) => SerializedFragment): SerializedFragment;
export declare function combineFragmentsK(a: SerializedFragment, b: SerializedFragment, c: SerializedFragment, p: (a: string, b: string, c: string) => SerializedFragment): SerializedFragment;
export declare function combineFragmentsK(a: SerializedFragment, b: SerializedFragment, c: SerializedFragment, d: SerializedFragment, p: (a: string, b: string, c: string, d: string) => SerializedFragment): SerializedFragment;
export declare function combineFragmentsK(a: SerializedFragment, b: SerializedFragment, c: SerializedFragment, d: SerializedFragment, e: SerializedFragment, p: (a: string, b: string, c: string, d: string, e: string) => SerializedFragment): SerializedFragment;
export declare function combineFragmentsK(a: SerializedFragment, b: SerializedFragment, c: SerializedFragment, d: SerializedFragment, e: SerializedFragment, f: SerializedFragment, p: (a: string, b: string, c: string, d: string, e: string, f: string) => SerializedFragment): SerializedFragment;
/**
 * @param f returns an Option
 */
export declare const getSerializedOptionCallFragment: (nullable: boolean, f: SerializedFragment, a: SerializedFragment) => SerializedFragment;
export declare const commaFragment: SerializedFragment;
