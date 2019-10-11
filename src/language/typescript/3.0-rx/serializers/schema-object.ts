import { OpenAPIV3 } from 'openapi-types';
import { serializedType, SerializedType } from '../../common/data/serialized-type';
import { dependency } from '../../common/data/serialized-dependency';
import { Either, left, right } from 'fp-ts/lib/Either';

export const serializeNonArraySchemaObject = (
	schemaObject: OpenAPIV3.NonArraySchemaObject,
): Either<Error, SerializedType> => {
	switch (schemaObject.type) {
		case 'null': {
			return right(serializedType('null', 'literal(null)', [dependency('literal', 'io-ts')], []));
		}
		case 'string': {
			return right(serializedType('string', 'string', [dependency('string', 'io-ts')], []));
		}
		case 'boolean': {
			return right(serializedType('boolean', 'boolean', [dependency('boolean', 'io-ts')], []));
		}
		case 'integer':
		case 'number': {
			return right(serializedType('number', 'number', [dependency('number', 'io-ts')], []));
		}
		case 'object': {
			return left(new Error('Objects are not supported as NonArraySchemaObject type'));
		}
	}
};

export const isNonEmptyArraySchemaObject = (
	schemaObject: OpenAPIV3.SchemaObject,
): schemaObject is OpenAPIV3.NonArraySchemaObject =>
	['null', 'boolean', 'object', 'number', 'string', 'integer'].includes(schemaObject.type);

export const serializeSchemaObject = (rootName: string, cwd: string) => (
	schemaObject: OpenAPIV3.SchemaObject,
): SerializedType => {
	switch (schemaObject.type) {
		case 'array':
			break;
		case 'null':
			break;
		case 'boolean':
			break;
		case 'object':
			break;
		case 'number':
			break;
		case 'string':
			break;
		case 'integer':
			break;
	}
	return serializedType('', '', [], []);
};
