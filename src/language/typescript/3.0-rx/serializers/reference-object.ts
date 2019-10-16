import { Context } from '../utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { ask } from 'fp-ts/lib/Reader';
import { OpenAPIV3 } from 'openapi-types';

export const isReferenceObject = <A>(object: OpenAPIV3.ReferenceObject | A): object is OpenAPIV3.ReferenceObject =>
	(object as any)['$ref'];

export const serializeRef = combineReader(ask<Context>(), context => context.serializeRef);
export const resolveReferenceObject = combineReader(ask<Context>(), context => context.resolveRef);
