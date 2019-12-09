import { directory, Directory, file, File } from '../../../../utils/fs';
import { collect } from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializePathItemObject, serializePathItemObjectTags } from './path-item-object';
import { Dictionary, serializeDictionary } from '../../../../utils/types';
import { foldSerializedTypes } from '../../common/data/serialized-type';
import { serializedDependency, serializeDependencies } from '../../common/data/serialized-dependency';
import { decapitalize, camelize } from '@devexperts/utils/dist/string';
import { Either, isLeft, right } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { array, either, option, record } from 'fp-ts';
import { addPathParts, getRelativePath, Ref } from '../../../../utils/ref';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { applyTo } from '../../../../utils/function';
import { PathsObject } from '../../../../schema/3.0/paths-object';
import { clientRef } from '../../common/bundled/client';
import { getControllerName } from '../../common/utils';

const serializeGrouppedPaths = combineReader(
	serializePathItemObject,
	serializePathItemObject => (from: Ref) => (groupped: PathsObject): Either<Error, File> => {
		const serializedHKT = pipe(
			serializeDictionary(groupped, (pattern, item) => serializePathItemObject(pattern, item, from, 'HKT')),
			sequenceEither,
			either.map(foldSerializedTypes),
		);
		const serializedKind = pipe(
			serializeDictionary(groupped, (pattern, item) => serializePathItemObject(pattern, item, from, '*')),
			sequenceEither,
			either.map(foldSerializedTypes),
		);
		const serializedKind2 = pipe(
			serializeDictionary(groupped, (pattern, item) => serializePathItemObject(pattern, item, from, '* -> *')),
			sequenceEither,
			either.map(foldSerializedTypes),
		);

		return combineEither(
			serializedHKT,
			serializedKind,
			serializedKind2,
			clientRef,
			(serializedHKT, serializedKind, serializedKind2, clientRef) => {
				const dependencies = serializeDependencies([
					...serializedHKT.dependencies,
					...serializedKind.dependencies,
					...serializedKind2.dependencies,
					serializedDependency('HTTPClient', getRelativePath(from, clientRef)),
					serializedDependency('HTTPClient1', getRelativePath(from, clientRef)),
					serializedDependency('HTTPClient2', getRelativePath(from, clientRef)),
					serializedDependency('URIS', 'fp-ts/lib/HKT'),
					serializedDependency('URIS2', 'fp-ts/lib/HKT'),
				]);
				return file(
					`${from.name}.ts`,
					`
						${dependencies}
						
						export interface ${from.name}<F> {
							${serializedHKT.type}
						}
						
						export interface ${from.name}1<F extends URIS> {
							${serializedKind.type}					
						}
						
						export interface ${from.name}2<F extends URIS2> {
							${serializedKind2.type}					
						}
						
						export function ${decapitalize(from.name)}<F extends URIS2>(e: { httpClient: HTTPClient2<F> }): ${from.name}2<F>
						export function ${decapitalize(from.name)}<F extends URIS>(e: { httpClient: HTTPClient1<F> }): ${from.name}1<F>
						export function ${decapitalize(from.name)}<F>(e: { httpClient: HTTPClient<F> }): ${from.name}<F>;
						export function ${decapitalize(from.name)}<F>(e: { httpClient: HTTPClient<F> }): ${from.name}<F> {
							return {
								${serializedHKT.io}
							}
						}
					`,
				);
			},
		);
	},
);

export const serializePathsObject = combineReader(
	serializeGrouppedPaths,
	serializeGrouppedPaths => (from: Ref) => (pathsObject: PathsObject): Either<Error, Directory> => {
		const groupped = groupPathsByTag(pathsObject);
		const files = pipe(
			groupped,
			collect((name, groupped) =>
				pipe(from, addPathParts(name), either.map(serializeGrouppedPaths), either.chain(applyTo(groupped))),
			),
			sequenceEither,
		);
		const index = pipe(
			from,
			addPathParts('paths'),
			either.chain(from => serializePathsIndex(from, record.keys(groupped))),
		);
		return combineEither(files, index, (files, index) => directory('paths', [...files, index]));
	},
);

const groupPathsByTag = (pathsObject: PathsObject): Dictionary<PathsObject> => {
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
