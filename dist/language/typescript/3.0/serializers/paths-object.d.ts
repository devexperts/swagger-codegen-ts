import { Directory } from '../../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { reader } from 'fp-ts';
import { Ref } from '../../../../utils/ref';
import { PathsObject } from '../../../../schema/3.0/paths-object';
export declare const serializePathsObject: reader.Reader<import("../../../../utils/ref").ResolveRefContext & import("./schema-object").SerializeSchemaObjectWithRecursionContext, (from: Ref<string>) => (pathsObject: PathsObject) => Either<Error, Directory>>;
