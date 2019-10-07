import { PathItemObject } from '../../../../schema/2.0/path-item-object';
import { foldSerializedTypes, SerializedType } from '../data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { map } from 'fp-ts/lib/Option';
import { serializeOperationObject } from './operation-object';
import { array } from 'fp-ts/lib/Array';
import { Dictionary, serializeDictionary } from '../../../../utils/types';
import { file, File } from '../../../../fs';
import { dependency, serializeDependencies } from '../data/serialized-dependency';
import { getRelativeClientPath } from '../utils';
import { decapitalize } from '@devexperts/utils/dist/string';

export const serializePathGroup = (name: string, group: Dictionary<PathItemObject>, cwd: string): File => {
	const groupName = `${name}Controller`;
	const serialized = foldSerializedTypes(
		serializeDictionary(group, (url, item) => serializePath(url, item, groupName, cwd)),
	);
	const dependencies = serializeDependencies([
		...serialized.dependencies,
		dependency('asks', 'fp-ts/lib/Reader'),
		dependency('APIClient', getRelativeClientPath(cwd)),
	]);
	return file(
		`${groupName}.ts`,
		`
			${dependencies}
		
			export interface ${groupName} {
				${serialized.type}
			}
			
			export const ${decapitalize(groupName)} = asks((e: { apiClient: APIClient }): ${groupName} => ({
				${serialized.io}
			}));
		`,
	);
};

const serializePath = (url: string, item: PathItemObject, rootName: string, cwd: string): SerializedType => {
	const get = pipe(
		item.get,
		map(operation => serializeOperationObject(url, 'GET', operation, rootName, cwd)),
	);
	const put = pipe(
		item.put,
		map(operation => serializeOperationObject(url, 'PUT', operation, rootName, cwd)),
	);
	const post = pipe(
		item.post,
		map(operation => serializeOperationObject(url, 'POST', operation, rootName, cwd)),
	);
	const remove = pipe(
		item.delete,
		map(operation => serializeOperationObject(url, 'DELETE', operation, rootName, cwd)),
	);
	const options = pipe(
		item.options,
		map(operation => serializeOperationObject(url, 'OPTIONS', operation, rootName, cwd)),
	);
	const head = pipe(
		item.head,
		map(operation => serializeOperationObject(url, 'HEAD', operation, rootName, cwd)),
	);
	const patch = pipe(
		item.patch,
		map(operation => serializeOperationObject(url, 'PATCH', operation, rootName, cwd)),
	);
	const operations = array.compact([get, put, post, remove, options, head, patch]);
	return foldSerializedTypes(operations);
};
