import { Directory } from '../../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { SwaggerObject } from '../../../../schema/2.0/swagger-object';
export declare const serializeSwaggerObject: import("fp-ts/lib/Reader").Reader<import("../../../../utils/ref").ResolveRefContext, (name: string, swaggerObject: SwaggerObject) => Either<Error, Directory>>;
