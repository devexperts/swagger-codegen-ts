import { SerializedDependency, uniqSerializedDependencies } from './serialized-dependency';
import { SerializedParameter } from './serialized-parameter';
import { Ref, uniqRefs } from '../../../../utils/ref';
import { getTypeName } from '../utils';

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
	dependencies: uniqSerializedDependencies(dependencies),
	refs: uniqRefs(refs),
});

export const fromSerializedParameter = (name: string) => (
	serialized: SerializedParameter,
): SerializedPathParameter => ({
	...serialized,
	name,
});

export const getSerializedPathParameterType = (serialized: SerializedPathParameter): SerializedPathParameter => {
	const name = getTypeName(serialized.name);
	return serializedPathParameter(
		name,
		`${name}: ${serialized.type}`,
		`${serialized.io}.encode(${name})`,
		serialized.isRequired,
		serialized.dependencies,
		serialized.refs,
	);
};
