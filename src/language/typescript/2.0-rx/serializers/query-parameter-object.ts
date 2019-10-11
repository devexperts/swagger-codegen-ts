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
import { dependency, EMPTY_DEPENDENCIES, OPTION_DEPENDENCIES } from '../../common/data/serialized-dependency';
import { EMPTY_REFS } from '../utils';
import { serializedType, SerializedType } from '../../common/data/serialized-type';
import { unless } from '../../../../utils/string';

const serializeRequired = (name: string, type: string, io: string, isRequired: boolean): SerializedType =>
	isRequired
		? serializedType(`${name}: ${type}`, `${name}: ${io}`, EMPTY_DEPENDENCIES, EMPTY_REFS)
		: serializedType(
				`${name}: Option<${type}>`,
				`${name}: optionFromNullable(${io})`,
				OPTION_DEPENDENCIES,
				EMPTY_REFS,
		  );

const serializeQueryParameterObject = (parameter: QueryParameterObject): SerializedParameter => {
	const isRequired = pipe(
		parameter.required,
		getOrElse(constFalse),
	);
	const serializedParameterType = serializePathOrQueryParameterObject(parameter);
	const serializedRequired = serializeRequired(
		parameter.name,
		serializedParameterType.type,
		serializedParameterType.io,
		isRequired,
	);

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
		serializedParameter(';', ',', false, EMPTY_DEPENDENCIES, EMPTY_REFS),
		serializedParameters,
	);
	const { isRequired, dependencies, refs, io, type } = intercalated;
	return serializedParameter(
		`query${unless(isRequired, '?')}: { ${type} }`,
		`query: type({ ${io} })`,
		intercalated.isRequired,
		[...dependencies, dependency('type', 'io-ts')],
		refs,
	);
};
