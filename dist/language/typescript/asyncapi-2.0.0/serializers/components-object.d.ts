import { Ref } from '../../../../utils/ref';
import { Either } from 'fp-ts/lib/Either';
import { FSEntity } from '../../../../utils/fs';
import { ComponentsObject } from '../../../../schema/asyncapi-2.0.0/components-object';
export declare const serializeComponentsObject: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext, (from: Ref<string>, componentsObject: ComponentsObject) => Either<Error, FSEntity>>;
