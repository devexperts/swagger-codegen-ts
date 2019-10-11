import { SerializedDependency } from './serialized-dependency';
import { SerializedParameter } from './serialized-parameter';

export interface SerializedPathParameter extends SerializedParameter {
	readonly name: string;
}

export const serializedPathParameter = (
	name: string,
	type: string,
	io: string,
	isRequired: boolean,
	dependencies: SerializedDependency[],
	refs: string[],
): SerializedPathParameter => ({
	name,
	type,
	io,
	isRequired,
	dependencies,
	refs,
});
