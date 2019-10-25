import { NonArrayItemsObject } from '../../../../schema/2.0/items-object/non-array-items-object';
import { serializedType, SerializedType } from '../../common/data/serialized-type';
import { serializedDependency } from '../../common/data/serialized-dependency';

export const serializeNonArrayItemsObject = (items: NonArrayItemsObject): SerializedType => {
	switch (items.type) {
		case 'string': {
			return serializedType('string', 'string', [serializedDependency('string', 'io-ts')], []);
		}
		case 'boolean': {
			return serializedType('boolean', 'boolean', [serializedDependency('boolean', 'io-ts')], []);
		}
		case 'integer':
		case 'number': {
			return serializedType('number', 'number', [serializedDependency('number', 'io-ts')], []);
		}
	}
};
