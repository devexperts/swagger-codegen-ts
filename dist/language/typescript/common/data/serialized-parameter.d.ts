import { SerializedType } from './serialized-type';
import { SerializedDependency } from './serialized-dependency';
import { Monoid } from 'fp-ts/lib/Monoid';
import { Ref } from '../../../../utils/ref';
export interface SerializedParameter extends SerializedType {
    readonly isRequired: boolean;
}
export declare const serializedParameter: (type: string, io: string, isRequired: boolean, dependencies: SerializedDependency[], refs: Ref<string>[]) => SerializedParameter;
export declare const fromSerializedType: (isRequired: boolean) => (serializedType: SerializedType) => SerializedParameter;
export declare const monoidSerializedParameter: Monoid<SerializedParameter>;
export declare const intercalateSerializedParameters: (sep: SerializedParameter, fm: SerializedParameter[]) => SerializedParameter;
