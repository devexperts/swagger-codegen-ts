import { Ref } from '../../../../utils/ref';
import { SerializedDependency } from './serialized-dependency';
import { SerializedParameter } from './serialized-parameter';
export interface SerializedHeaderParameter extends SerializedParameter {
    readonly name: string;
}
export declare const serializedHeaderParameter: (name: string, type: string, io: string, isRequired: boolean, dependencies: SerializedDependency[], refs: Ref<string>[]) => SerializedHeaderParameter;
export declare const fromSerializedHeaderParameter: (name: string) => (serialized: SerializedParameter) => SerializedHeaderParameter;
export declare const getSerializedHeaderParameterType: (serialized: SerializedHeaderParameter) => SerializedHeaderParameter;
