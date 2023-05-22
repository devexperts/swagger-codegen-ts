import { SerializedType } from '../../common/data/serialized-type';
import { Either } from 'fp-ts/lib/Either';
import { reader } from 'fp-ts';
import { Ref } from '../../../../utils/ref';
import { SchemaObject, PrimitiveSchemaObject } from '../../../../schema/3.0/schema-object';
export declare type SerializeSchemaObjectWithRecursion = (from: Ref, shouldTrackRecursion: boolean, name?: string) => (schemaObject: SchemaObject) => Either<Error, SerializedType>;
export declare type SerializePrimitive = (from: Ref, schemaObject: PrimitiveSchemaObject) => Either<Error, SerializedType>;
export interface SerializeSchemaObjectWithRecursionContext {
    serializePrimitive: SerializePrimitive;
}
export declare const serializeSchemaObjectWithRecursion: reader.Reader<SerializeSchemaObjectWithRecursionContext, SerializeSchemaObjectWithRecursion>;
export declare const serializePrimitiveDefault: (from: Ref<string>, schemaObject: PrimitiveSchemaObject) => Either<Error, SerializedType>;
export declare const serializeSchemaObject: reader.Reader<SerializeSchemaObjectWithRecursionContext, (from: Ref<string>, name?: string | undefined) => (schemaObject: SchemaObject) => Either<Error, SerializedType>>;
export declare const serializeSchemaObjectDefault: (from: Ref<string>, name?: string | undefined) => (schemaObject: SchemaObject) => Either<Error, SerializedType>;
