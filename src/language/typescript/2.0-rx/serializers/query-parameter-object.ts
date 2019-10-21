import { QueryParameterObject } from '../../../../schema/2.0/parameter-object/query-parameter-object/query-parameter-object';
import {
	intercalateSerializedParameters,
	serializedParameter,
	SerializedParameter,
} from '../../common/data/serialized-parameter';
import { pipe } from 'fp-ts/lib/pipeable';
import { getOrElse } from 'fp-ts/lib/Option';
import { constFalse } from 'fp-ts/lib/function';
import { serializePathOrQueryParameterObject } from './path-or-query-parameter-object';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { getSerializedPropertyType } from '../../common/data/serialized-type';
import { unless } from '../../../../utils/string';

const serializeQueryParameterObject = (parameter: QueryParameterObject): SerializedParameter => {
	const isRequired = pipe(
		parameter.required,
		getOrElse(constFalse),
	);
	const serializedParameterType = serializePathOrQueryParameterObject(parameter);
	const serializedRequired = getSerializedPropertyType(parameter.name, isRequired)(serializedParameterType);

	return serializedParameter(
		serializedRequired.type,
		serializedRequired.io,
		serializedParameterType.isRequired || isRequired,
		[...serializedParameterType.dependencies, ...serializedRequired.dependencies],
		serializedRequired.refs,
	);
};

export const serializeQueryParameterObjects = (
	parameters: NonEmptyArray<QueryParameterObject>,
): SerializedParameter => {
	const serializedParameters = parameters.map(serializeQueryParameterObject);
	const intercalated = intercalateSerializedParameters(
		serializedParameter(';', ',', false, [], []),
		serializedParameters,
	);
	const { isRequired, dependencies, refs, io, type } = intercalated;
	return serializedParameter(
		`query${unless(isRequired, '?')}: { ${type} }`,
		`query: type({ ${io} })`,
		intercalated.isRequired,
		[...dependencies, serializedDependency('type', 'io-ts')],
		refs,
	);
};
