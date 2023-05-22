import { Ref } from '../../../../utils/ref';
import { Either } from 'fp-ts/lib/Either';
import { SerializedType } from '../../common/data/serialized-type';
import { SchemaObject } from '../../../../schema/asyncapi-2.0.0/schema-object';
export declare const serializeSchemaObject: (from: Ref<string>, schemaObject: SchemaObject, name?: string | undefined) => Either<Error, SerializedType>;
