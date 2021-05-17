import { constant } from 'fp-ts/lib/function';
import { fromString } from '../../../../../utils/ref';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, record } from 'fp-ts';
import { sequenceTEither } from '@devexperts/utils/dist/adt/either.utils';
import { ChannelItemObjectCodec } from '../../../../../schema/asyncapi-2.0.0/channel-item-object';
import { serializeChannelItemObject as createSerializeChannelItemObject } from '../channel-item-object';
import { normalizeType } from '../../../../../../test/utils';
import { reportIfFailed } from '../../../../../utils/io-ts';
import { flow } from 'fp-ts/lib/function';

const refs = {
	'#/components/schemas/ChatCategory': {
		schema: {
			type: 'string',
		},
	},
};

describe('ChannelItemObject', () => {
	describe('serializeChannelItemObject', () => {
		const serializeChannelItemObject = createSerializeChannelItemObject({
			resolveRef: (ref, dec) =>
				pipe(
					record.lookup(ref, refs),
					either.fromOption(() => new Error('Refs not supported')),
					either.chain(flow(dec.decode, reportIfFailed)),
				),
		});

		it('should correctly handle channel path parameters without other parameters', () => {
			const operation = pipe(
				ChannelItemObjectCodec.decode({
					description: 'Sample channel',
					parameters: {
						userId: {
							schema: { type: 'number' },
						},
						topic: {
							schema: { type: 'string' },
						},
					},
					publish: {
						message: {
							payload: {
								type: 'object',
								properties: {
									text: { type: 'string' },
								},
							},
						},
					},
				}),
				either.mapLeft(constant(new Error())),
			);

			const result = pipe(
				sequenceTEither(operation, fromString('#/whatever')),
				either.chain(([op, ref]) => serializeChannelItemObject(ref, '/message/{userId}/{topic}', op, 'HKT')),
				either.map(result =>
					normalizeType({
						...result,
						io: `const channels = {${result.io}}`,
						type: `type Channels = {${result.type}}`,
					}),
				),
			);

			expect(result).toEqual(
				either.right(
					normalizeType({
						type: `
							type Channels = {
  								['/message/{userId}/{topic}']:
  									(parameters: { topic: string; userId: number }) =>
  										{ send: (payload: { text: Option<string> }) => void }
							}
						`,
						io: `
							const channels = {['/message/{userId}/{topic}']: (parameters) => {
								const channel = e.webSocketClient.channel({
									channel: \`/message/\${encodeURIComponent(number.encode(parameters.userId).toString())}/\${encodeURIComponent(string.encode(parameters.topic).toString())}\`,
									method: 'GET',
								})

								return {
									send: payload => {
										channel.send(type({ text: optionFromNullable(string) }).encode(payload));
									}
								};
							}}`,
						dependencies: [
							{ name: 'string', path: 'io-ts' },
							{ name: 'Option', path: 'fp-ts/lib/Option' },
							{ name: 'optionFromNullable', path: 'io-ts-types/lib/optionFromNullable' },
							{ name: 'type', path: 'io-ts' },
							{ name: 'number', path: 'io-ts' },
							{ name: 'WebSocketClient', path: './/client/client' },
							{ name: 'partial', path: 'io-ts' },
						],
						refs: [],
					}),
				),
			);
		});

		it('should correctly handle channel path parameters with other parameters', () => {
			const operation = pipe(
				ChannelItemObjectCodec.decode({
					description: 'Sample channel',
					parameters: {
						userId: {
							schema: { type: 'number' },
						},
						category: {
							$ref: '#/components/schemas/ChatCategory',
						},
					},
					bindings: {
						ws: {
							query: {
								type: 'object',
								properties: {
									search: { type: 'string' },
								},
							},
						},
					},
					publish: {
						message: {
							payload: {
								type: 'object',
								properties: {
									text: { type: 'string' },
								},
							},
						},
					},
				}),
				either.mapLeft(constant(new Error())),
			);

			const result = pipe(
				sequenceTEither(operation, fromString('#/whatever')),
				either.chain(([op, ref]) => serializeChannelItemObject(ref, '/message/{userId}/{category}', op, 'HKT')),
				either.map(result =>
					normalizeType({
						...result,
						io: `const channels = {${result.io}}`,
						type: `type Channels = {${result.type}}`,
					}),
				),
			);

			expect(result).toEqual(
				either.right(
					normalizeType({
						type: `
							type Channels = {
  								['/message/{userId}/{category}']:
  									(parameters: {query?: {search: Option<string>}; category: string; userId: number }) =>
  										{ send: (payload: { text: Option<string> }) => void }
							}
						`,
						io: `
							const channels = {
								['/message/{userId}/{category}']: (parameters) => {
									const encoded = partial({
										query: type({ search: optionFromNullable(string) })
									}).encode(parameters);
									const channel = e.webSocketClient.channel({
										channel: \`/message/\${
												encodeURIComponent(number.encode(parameters.userId).toString())
											}/\${
												encodeURIComponent(string.encode(parameters.category).toString())
											}\`,
										method: 'GET',
										...encoded
									});

									return {
										send: payload => {
											channel.send(type({ text: optionFromNullable(string) }).encode(payload));
										}
									};
								}
							}
						`,
						dependencies: [
							{ name: 'string', path: 'io-ts' },
							{ name: 'Option', path: 'fp-ts/lib/Option' },
							{ name: 'optionFromNullable', path: 'io-ts-types/lib/optionFromNullable' },
							{ name: 'type', path: 'io-ts' },
							{ name: 'number', path: 'io-ts' },
							{ name: 'WebSocketClient', path: './/client/client' },
							{ name: 'partial', path: 'io-ts' },
						],
						refs: [],
					}),
				),
			);
		});
	});
});
