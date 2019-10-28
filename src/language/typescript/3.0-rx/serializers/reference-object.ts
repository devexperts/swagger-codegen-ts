import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { ask } from 'fp-ts/lib/Reader';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { Context } from '../../common/utils';

export const isReferenceObject = <A>(object: ReferenceObject | A): object is ReferenceObject =>
	ReferenceObjectCodec.is(object);

export const resolveReferenceObject = combineReader(ask<Context>(), context => context.resolveRef);
