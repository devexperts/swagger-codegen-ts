import { Either } from 'fp-ts/lib/Either';
import { Directory } from '../../../../utils/fs';
import { Ref } from '../../../../utils/ref';
import { ComponentsObject } from '../../../../schema/3.0/components-object';
export declare const serializeComponentsObject: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext & import("./schema-object").SerializeSchemaObjectWithRecursionContext, (from: Ref<string>) => (componentsObject: ComponentsObject) => Either<Error, Directory>>;
