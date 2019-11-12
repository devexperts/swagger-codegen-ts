import { getCollectionSeparator, serializeQueryParameterObject } from '../operation-object';
import { fromString } from '../../../../../utils/ref';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import {
	ArrayParameterObjectCollectionFormat,
	ArrayQueryParameterObjectCodec,
} from '../../../../../schema/2.0/parameter-object';
import { combineEither, sequenceTEither } from '@devexperts/utils/dist/adt/either.utils';
import { reportIfFailed } from '../../../../../utils/io-ts';
import { serializedFragment } from '../../../common/data/serialized-fragment';
import {
	getSerializedArrayType,
	getSerializedIntegerType,
	getSerializedOptionalType,
} from '../../../common/data/serialized-type';
import { utilsRef } from '../../../common/bundled/utils';
import { serializedDependency } from '../../../common/data/serialized-dependency';
import { serializeParameterObject } from '../parameter-object';

describe('Operation Object serialization', () => {
	it('serializeArrayQueryParameter', () => {
		const from = fromString('#/from');
		const required = false;
		const target = 'parameters.query';
		const collectionFormat: ArrayParameterObjectCollectionFormat = 'multi' as ArrayParameterObjectCollectionFormat;
		const name = 'queryParam';
		const spec = ArrayQueryParameterObjectCodec.decode({
			in: 'query',
			name,
			type: 'array',
			required,
			items: {
				type: 'integer',
			},
			collectionFormat,
		});

		const serialized = pipe(
			sequenceTEither(from, reportIfFailed(spec)),
			either.chain(([from, spec]) =>
				pipe(
					serializeParameterObject(from, spec),
					either.map(serialized => getSerializedOptionalType(required, serialized)),
					either.chain(serialized => serializeQueryParameterObject(from, spec, serialized, target)),
				),
			),
		);

		const expected = combineEither(from, utilsRef, (from, utilsRef) => {
			const type = pipe(
				getSerializedIntegerType(from, utilsRef),
				getSerializedArrayType(),
				serialized => getSerializedOptionalType(required, serialized),
			);
			const encoded = `${type.io}.encode(${target}.${name})`;
			switch (collectionFormat) {
				case 'csv':
				case 'pipes':
				case 'ssv':
				case 'tsv': {
					const separator = getCollectionSeparator(collectionFormat);
					return serializedFragment(
						`${name}=\${${encoded}.join('${separator}')}`,
						type.dependencies,
						type.refs,
					);
				}
				case 'multi': {
					const process = `.map(value => \`${name}=\${value}\`).join('&')`;
					if (required) {
						return serializedFragment(`\${${encoded}${process}}`, type.dependencies, type.refs);
					} else {
						return serializedFragment(
							`\${pipe(${encoded}, option.fromNullable, option.map(value => value${process}), option.getOrElse(() => ''))}`,
							[...type.dependencies, serializedDependency('option', 'fp-ts')],
							type.refs,
						);
					}
				}
			}
		});
		expect(serialized).toEqual(expected);
	});
});
