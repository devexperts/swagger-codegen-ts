import { PathsObject } from '../../../../schema/2.0/paths-object';
import { directory, Directory, File, file } from '../../../../utils/fs';
import { serializePathGroup, serializePathItemObjectTags } from './path-item-object';
import { CONTROLLERS_DIRECTORY, getControllerName } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, option, record } from 'fp-ts';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { Either, isLeft, right } from 'fp-ts/lib/Either';
import { addPathParts, getRelativePath, Ref } from '../../../../utils/ref';
import { Dictionary } from '../../../../utils/types';
import { PathItemObject } from '../../../../schema/2.0/path-item-object';
import { camelize, decapitalize } from '@devexperts/utils/dist/string/string';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializedDependency, serializeDependencies } from '../../common/data/serialized-dependency';
import { clientRef } from '../../common/bundled/client';

export const serializePaths = combineReader(
	serializePathGroup,
	serializePathGroup => (from: Ref, paths: PathsObject): Either<Error, Directory> => {
		const groupped = groupPathsByTag(paths);
		const files = pipe(
			groupped,
			record.collect((name, group) =>
				pipe(
					from,
					addPathParts(name),
					either.chain(from => serializePathGroup(from, name, group)),
				),
			),
			sequenceEither,
		);
		const index = pipe(
			from,
			addPathParts(CONTROLLERS_DIRECTORY),
			either.chain(from => serializePathsIndex(from, record.keys(groupped))),
		);
		return combineEither(files, index, (files, index) => directory(CONTROLLERS_DIRECTORY, [...files, index]));
	},
);

const serializePathsIndex = (from: Ref, pathNames: string[]): Either<Error, File> => {
	if (isLeft(clientRef)) {
		return clientRef;
	}
	const pathToClient = getRelativePath(from, clientRef.right);
	const dependencies = serializeDependencies([
		...array.flatten(
			pathNames.map(name => {
				const p = `./${name}`;
				return [
					serializedDependency(decapitalize(name), p),
					serializedDependency(name, p),
					serializedDependency(`${name}1`, p),
					serializedDependency(`${name}2`, p),
				];
			}),
		),
		serializedDependency('URIS', 'fp-ts/lib/HKT'),
		serializedDependency('URIS2', 'fp-ts/lib/HKT'),
		serializedDependency('URIS2', 'fp-ts/lib/HKT'),
		serializedDependency('HTTPClient', pathToClient),
		serializedDependency('HTTPClient1', pathToClient),
		serializedDependency('HTTPClient2', pathToClient),
	]);
	const content = `
		export interface Controllers<F> { 
			${pathNames.map(name => `${decapitalize(name)}: ${name}<F>;`).join('\n')} 
		}
		export interface Controllers1<F extends URIS> {
			${pathNames.map(name => `${decapitalize(name)}: ${name}1<F>;`).join('\n')} 			
		}
		export interface Controllers2<F extends URIS2> {
			${pathNames.map(name => `${decapitalize(name)}: ${name}2<F>;`).join('\n')} 			
		} 
		
		export function controllers<F extends URIS2>(e: { httpClient: HTTPClient2<F> }): Controllers2<F>
		export function controllers<F extends URIS>(e: { httpClient: HTTPClient1<F> }): Controllers1<F>
		export function controllers<F>(e: { httpClient: HTTPClient<F> }): Controllers<F>;
		export function controllers<F>(e: { httpClient: HTTPClient<F> }): Controllers<F> {
			return {
				${pathNames.map(name => `${decapitalize(name)}: ${decapitalize(name)}(e),`).join('\n')}
			}
		}
	`;
	return right(
		file(
			`${from.name}.ts`,
			`
				${dependencies}
				
				${content}
			`,
		),
	);
};

const groupPathsByTag = (pathsObject: PathsObject): Dictionary<Dictionary<PathItemObject>> => {
	const keys = Object.keys(pathsObject);
	const result: Record<string, PathsObject> = {};
	for (const key of keys) {
		const path = pathsObject[key];
		const tag = pipe(
			serializePathItemObjectTags(path),
			option.map(p => getControllerName(camelize(p, false))),
			option.getOrElse(() => getControllerName('Unknown')),
		);
		result[tag] = {
			...(result[tag] || {}),
			[key]: path,
		};
	}
	return result;
};
