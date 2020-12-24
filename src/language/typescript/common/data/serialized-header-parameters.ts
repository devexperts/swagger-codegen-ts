import { Ref, uniqRefs } from '../../../../utils/ref';
import { getTypeName } from '../utils';
import { serializedDependency, SerializedDependency, uniqSerializedDependencies } from './serialized-dependency';
import { SerializedParameter } from './serialized-parameter';

export interface SerializedHeaderParameter extends SerializedParameter {
	readonly name: string;
}

export const serializedHeaderParameter = (
	name: string,
	type: string,
	io: string,
	isRequired: boolean,
	dependencies: SerializedDependency[],
	refs: Ref[],
): SerializedHeaderParameter => ({
	name,
	type,
	io,
	isRequired,
	dependencies: uniqSerializedDependencies(dependencies),
	refs: uniqRefs(refs),
});

export const fromSerializedHeaderParameter = (name: string) => (
	serialized: SerializedParameter,
): SerializedHeaderParameter => ({
	...serialized,
	name,
});

export const getSerializedHeaderParameterType = (serialized: SerializedHeaderParameter): SerializedHeaderParameter => {
	const name = getTypeName(serialized.name);
	return serializedHeaderParameter(
		name,
		`${name}: ${serialized.isRequired ? serialized.type : `option.Option<${serialized.type}>`}`,
		`${name}: ${serialized.isRequired ? serialized.io : `optionFromNullable(${serialized.io})`}`,
		serialized.isRequired,
		serialized.dependencies.concat(
			serialized.isRequired
				? []
				: [
						serializedDependency('optionFromNullable', 'io-ts-types/lib/optionFromNullable'),
						serializedDependency('option', 'fp-ts'),
				  ],
		),
		serialized.refs,
	);
};
