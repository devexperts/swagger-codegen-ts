import { PathsObject } from '../../../../schema/2.0/paths-object';
import { alt, chain, getOrElse, map, mapNullable, option, Option, some } from 'fp-ts/lib/Option';
import { ParametersDefinitionsObject } from '../../../../schema/2.0/parameters-definitions-object';
import { directory, Directory } from '../../../../utils/fs';
import { getTagsFromPath, serializePathGroup } from './path-item-object';
import { CONTROLLERS_DIRECTORY } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, record } from 'fp-ts';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { Either } from 'fp-ts/lib/Either';
import { addPathParts, Ref } from '../../../../utils/ref';
import { ReferenceObject } from '../../../../schema/2.0/reference-object';
import { ParameterObject } from '../../../../schema/2.0/parameter-object/parameter-object';
import { array, last, uniq } from 'fp-ts/lib/Array';
import { Dictionary } from '../../../../utils/types';
import { PathItemObject } from '../../../../schema/2.0/path-item-object';
import { constant, Endomorphism, identity } from 'fp-ts/lib/function';
import { OperationObject } from '../../../../schema/2.0/operation-object';
import { eqString, getStructEq } from 'fp-ts/lib/Eq';

const paramSetoid = getStructEq<ReferenceObject | ParameterObject>({
	name: eqString,
	$ref: eqString,
});
const addPathParametersToTag = (
	pathParams: Array<ReferenceObject | ParameterObject>,
): Endomorphism<Array<ReferenceObject | ParameterObject>> => tagParams =>
	uniq(paramSetoid)([...pathParams, ...tagParams]);
const resolveTagParameter = (fileParameters: ParametersDefinitionsObject) => (
	parameter: ReferenceObject | ParameterObject,
): Option<ParameterObject> => {
	if (!ReferenceObject.is(parameter)) {
		return some(parameter);
	}
	return pipe(
		last(parameter.$ref.split('/')),
		mapNullable(ref => fileParameters[ref]),
	);
};

const getTagWithResolvedParameters = (
	addPathParametersToTag: Endomorphism<Array<ReferenceObject | ParameterObject>>,
	resolveTagParameter: (parameter: ReferenceObject | ParameterObject) => Option<ParameterObject>,
) => (tag: OperationObject): OperationObject => ({
	...tag,
	parameters: pipe(
		tag.parameters,
		alt<Array<ReferenceObject | ParameterObject>>(constant(some([]))),
		map(addPathParametersToTag),
		map(parameters => parameters.map(resolveTagParameter)),
		chain(array.sequence(option)),
	),
});

export const groupPathsByTag = (
	paths: PathsObject,
	parameters: Option<ParametersDefinitionsObject>,
): Dictionary<Dictionary<PathItemObject>> => {
	const keys = Object.keys(paths);
	const result: Record<string, Dictionary<PathItemObject>> = {};
	const resolveTagParam = pipe(
		parameters,
		map(resolveTagParameter),
	);
	for (const key of keys) {
		const path = paths[key];
		const pathParams = path.parameters;
		const addPathParamsToTag = pipe(
			pathParams,
			map(addPathParametersToTag),
		);
		const processTag = pipe(
			addPathParamsToTag,
			chain(addPathParamsToTag =>
				pipe(
					resolveTagParam,
					map(resolveTagParam => getTagWithResolvedParameters(addPathParamsToTag, resolveTagParam)),
				),
			),
			getOrElse<Endomorphism<OperationObject>>(() => identity),
		);
		const pathWithParams: PathItemObject = pipe(
			pathParams,
			map(() => ({
				...path,
				get: pipe(
					path.get,
					map(processTag),
				),
				post: pipe(
					path.post,
					map(processTag),
				),
				put: pipe(
					path.put,
					map(processTag),
				),
				delete: pipe(
					path.delete,
					map(processTag),
				),
			})),
			getOrElse(() => path),
		);
		const tags = getTagsFromPath(pathWithParams);
		const tag = tags.join('').replace(/\s/g, '');

		result[tag] = {
			...(result[tag] || {}),
			[key]: pathWithParams,
		};
	}
	return result;
};

export const serializePaths = (
	from: Ref,
	paths: PathsObject,
	parameters: Option<ParametersDefinitionsObject>,
): Either<Error, Directory> =>
	pipe(
		groupPathsByTag(paths, parameters),
		record.collect((name, group) => {
			return pipe(
				from,
				addPathParts(`${name}Controller`),
				either.chain(from => serializePathGroup(from, name, group)),
			);
		}),
		sequenceEither,
		either.map(serialized => directory(CONTROLLERS_DIRECTORY, serialized)),
	);
