import { NonArrayItemsObject } from '../../../../schema/2.0/items-object/non-array-items-object';
import { serializedType, SerializedType } from '../data/serialized-type';
import { dependency } from '../data/serialized-dependency';
import { EMPTY_REFS } from '../utils';

export const serializeNonArrayItemsObject = (items: NonArrayItemsObject): SerializedType => {
	switch (items.type) {
		case 'string': {
			return serializedType('string', 'string', [dependency('string', 'io-ts')], EMPTY_REFS);
		}
		case 'boolean': {
			return serializedType('boolean', 'boolean', [dependency('boolean', 'io-ts')], EMPTY_REFS);
		}
		case 'integer':
		case 'number': {
			return serializedType('number', 'number', [dependency('number', 'io-ts')], EMPTY_REFS);
		}
	}
};
