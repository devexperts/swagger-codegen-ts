import { SerializedDependency } from './serialized-dependency';
import { SerializedParameter } from './serialized-parameter';
import { Ref } from '../../../../utils/ref';
export interface SerializedPathParameter extends SerializedParameter {
    readonly name: string;
}
export declare const serializedPathParameter: (name: string, type: string, io: string, isRequired: boolean, dependencies: SerializedDependency[], refs: Ref<string>[]) => SerializedPathParameter;
export declare const fromSerializedParameter: (name: string) => (serialized: SerializedParameter) => SerializedPathParameter;
export declare const getSerializedPathParameterType: (serialized: SerializedPathParameter) => SerializedPathParameter;
