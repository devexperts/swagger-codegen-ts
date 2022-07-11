import { SerializedType } from '../../common/data/serialized-type';
import { SchemaObject } from '../../../../schema/2.0/schema-object';
import { Ref } from '../../../../utils/ref';
import { Either } from 'fp-ts/lib/Either';
export declare const serializeSchemaObject: (from: Ref<string>, schema: SchemaObject) => Either<Error, SerializedType>;
