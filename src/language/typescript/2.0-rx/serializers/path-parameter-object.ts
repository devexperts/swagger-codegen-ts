import { PathParameterObject } from '../../../../schema/2.0/parameter-object/path-parameter-object/path-parameter-object';
import { serializedPathParameter, SerializedPathParameter } from '../data/serialized-path-parameter';
import { serializePathOrQueryParameterObject } from './path-or-query-parameter-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { map, toUndefined } from 'fp-ts/lib/Option';

export const serializePathParameter = (parameter: PathParameterObject): SerializedPathParameter => {
	const serializedParameterType = serializePathOrQueryParameterObject(parameter);

	return serializedPathParameter(
		parameter.name,
		`${parameter.name}: ${serializedParameterType.type}`,
		`${serializedParameterType.io}.encode(${parameter.name})`,
		true,
		serializedParameterType.dependencies,
		serializedParameterType.refs,
	);
};

export const serializePathParameterDescription = (parameter: PathParameterObject): string =>
	`@param { ${serializePathOrQueryParameterObject(parameter).type} } ${parameter.name} ${pipe(
		parameter.description,
		map(d => '- ' + d),
		toUndefined,
	)}`;
