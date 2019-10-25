import { SerializedDependency } from './serialized-dependency';
import { SerializedParameter } from './serialized-parameter';
import { Ref } from '../../../../utils/ref';

export interface SerializedPathParameter extends SerializedParameter {
	readonly name: string;
}

export const serializedPathParameter = (
	name: string,
	type: string,
	io: string,
	isRequired: boolean,
	dependencies: SerializedDependency[],
	refs: Ref[],
): SerializedPathParameter => ({
	name,
	type,
	io,
	isRequired,
	dependencies,
	refs,
});

export const fromSerializedParameter = (name: string) => (
	serialized: SerializedParameter,
): SerializedPathParameter => ({
	...serialized,
	name,
});
