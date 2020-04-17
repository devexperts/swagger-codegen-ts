import { serializeOperationResponses } from '../responses-object';
import { constant } from 'fp-ts/lib/function';
import { fromString } from '../../../../../utils/ref';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { sequenceTEither } from '@devexperts/utils/dist/adt/either.utils';
import { ResponsesObject } from '../../../../../schema/2.0/responses-object';

describe('ResponsesObject', () => {
	describe('serializeResponsesObject', () => {
		it('should serialize void response if it is the only response type', () => {
			const responses = pipe(
				ResponsesObject.decode({
					200: {
						description: 'Success (void)',
					},
				}),
				either.mapLeft(constant(new Error())),
			);

			const result = pipe(
				sequenceTEither(fromString('#/test'), responses),
				either.chain(([ref, responses]) => serializeOperationResponses(ref, responses)),
			);

			pipe(
				result,
				either.fold(fail, result => {
					expect(result.type).toEqual('void');
					expect(result.io).toEqual('tvoid');
				}),
			);
		});

		it('should include void response into the union if needed', () => {
			const responses = pipe(
				ResponsesObject.decode({
					200: {
						description: 'Success (void)',
					},
					400: {
						description: 'Error',
						schema: {
							type: 'object',
							required: ['code'],
							properties: {
								code: {
									type: 'number',
								},
							},
						},
					},
				}),
				either.mapLeft(constant(new Error())),
			);

			const result = pipe(
				sequenceTEither(fromString('#/test'), responses),
				either.chain(([ref, responses]) => serializeOperationResponses(ref, responses)),
			);

			pipe(
				result,
				either.fold(fail, result => {
					expect(result.type).toEqual('void|{ code: number }');
					expect(result.io).toEqual("union([tvoid,type({ code: number }, 'test')])");
				}),
			);
		});
	});
});
