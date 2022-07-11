import { Directory } from '../../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { OpenapiObject } from '../../../../schema/3.0/openapi-object';
export declare const serializeDocument: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext & import("./schema-object").SerializeSchemaObjectWithRecursionContext, (name: string, document: OpenapiObject) => Either<Error, Directory>>;
