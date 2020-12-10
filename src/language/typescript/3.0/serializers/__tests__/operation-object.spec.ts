import { getParameters as createGetParameters } from '../operation-object';
import { constant } from 'fp-ts/lib/function';
import { left } from 'fp-ts/lib/Either';
import { fromString } from '../../../../../utils/ref';
import { PathItemObjectCodec } from '../../../../../schema/3.0/path-item-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option } from 'fp-ts';
import { OperationObjectCodec } from '../../../../../schema/3.0/operation-object';
import { sequenceTEither } from '@devexperts/utils/dist/adt/either.utils';

describe('OperationObject', () => {
	describe('getParameters', () => {
		const getParameters = createGetParameters({
			resolveRef: constant(left(new Error('Refs not supported'))),
		});

		it('should correctly handle primitive query parameters', () => {
			const operation = pipe(
				OperationObjectCodec.decode({
					responses: {},
					parameters: [
						{
							in: 'query',
							name: 'offset',
							required: false,
							schema: {
								type: 'number',
							},
						},
						{
							in: 'query',
							name: 'limit',
							required: true,
							schema: {
								type: 'number',
							},
						},
					],
				}),
				either.mapLeft(constant(new Error())),
			);

			const pathItem = pipe(PathItemObjectCodec.decode({}), either.mapLeft(constant(new Error())));

			const result = pipe(
				sequenceTEither(fromString('#/test'), operation, pathItem),
				either.chain(([ref, operation, pathItem]) => getParameters(ref, operation, pathItem)),
			);

			const generated = pipe(
				result,
				option.fromEither,
				option.chain(result => result.serializedQueryString),
				option.fold(constant(''), fragment => fragment.value.replace(/\s+/g, ' ')),
			);

			expect(generated).toEqual(
				`compact([pipe(
					optionFromNullable(number).encode(parameters.query['offset']),
					option.fromNullable,
					option.chain(value => fromEither(serializePrimitiveParameter('form', 'offset', value))),
				),pipe(
					number.encode(parameters.query['limit']),
					value => fromEither(serializePrimitiveParameter('form', 'limit', value)),
				)]).join('&')`
					.trim()
					.replace(/\s+/g, ' '),
			);
		});
	});
});
