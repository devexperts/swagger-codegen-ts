import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { fromString } from '../../../../utils/ref';
import { fromRef } from '../../../../utils/fs';

const content = `
	import { size } from 'fp-ts/lib/Record';
	import { pipe } from 'fp-ts/lib/pipeable';
	import { record } from 'fp-ts';
	import { Either, left, right } from 'fp-ts/lib/Either';
	import { flow } from 'fp-ts/lib/function';

	const join = (separator: string) => (parts: string[]): string => parts.join(separator);

	export const serializePrimitiveParameter = (style: string, name: string, value: unknown): Either<Error, string> => {
		switch (style) {
			case 'matrix': {
				return right(\`;\${name}=\${encodeURIComponent(String(value))}\`);
			}
			case 'label': {
				return right(\`.\${encodeURIComponent(String(value))}\`);
			}
			case 'form': {
				return right(\`\${name}=\${encodeURIComponent(String(value))}\`);
			}
			case 'simple': {
				return right(\`\${encodeURIComponent(String(value))}\`);
			}
		}
		return left(new Error(\`Unsupported style "\${style}" for parameter "\${name}"\`));
	};

	export const serializeArrayParameter = (
		style: string,
		name: string,
		value: unknown[],
		explode: boolean,
	): Either<Error, string> => {
		const encodedValue = value.map(flow(String, encodeURIComponent));

		switch (style) {
			case 'matrix': {
				return right(
					encodedValue.length === 0
						? \`;\${name}\`
						: explode
						? \`\${encodedValue.map(item => \`;\${name}=\${item}\`).join('')}\`
						: \`;\${name}=\${encodedValue.join(',')}\`,
				);
			}
			case 'label': {
				return right(encodedValue.map(item => \`.\${item}\`).join(''));
			}
			case 'form': {
				return right(explode ? \`\${encodedValue.map(item => \`\${name}=\${item}\`).join('&')}\` : \`\${name}=\${encodedValue.join(',')}\`);
			}
			case 'simple': {
				return right(encodedValue.join(','));
			}
			case 'spaceDelimited': {
				return right(encodedValue.join(' '));
			}
			case 'pipeDelimited': {
				return right(encodedValue.join('|'));
			}
		}
		return left(new Error(\`Unsupported style "\${style}" for parameter "\${name}"\`));
	};

	export const serializeObjectParameter = (
		style: string,
		name: string,
		value: Record<string, unknown>,
		explode: boolean,
	): Either<Error, string> => {
		switch (style) {
			case 'matrix': {
				return right(
					size(value) === 0
						? \`;\${name}\`
						: explode
						? pipe(
								value,
								record.collect((key, item) => \`;\${key}=\${item}\`),
								join(''),
						  )
						: \`;\${name}=\${pipe(
								value,
								record.collect((key, item) => \`\${key},\${item}\`),
								join(','),
						  )}\`,
				);
			}
			case 'label': {
				return right(
					explode
						? pipe(
								value,
								record.collect((key, item) => \`.\${key}=\${item}\`),
								join(''),
						  )
						: pipe(
								value,
								record.collect((key, item) => \`.\${key}.\${item}\`),
								join(''),
						  ),
				);
			}
			case 'form': {
				return right(
					explode
						? pipe(
								value,
								record.collect((key, item) => \`\${key}=\${item}\`),
								join('&'),
						  )
						: \`\${name}=\${pipe(
								value,
								record.collect((key, item) => \`\${key},\${item}\`),
								join(','),
						  )}\`,
				);
			}
			case 'simple': {
				return right(
					explode
						? pipe(
								value,
								record.collect((key, item) => \`\${key}=\${item}\`),
								join(','),
						  )
						: pipe(
								value,
								record.collect((key, item) => \`\${key},\${item}\`),
								join(','),
						  ),
				);
			}
			case 'spaceDelimited': {
				return right(
					pipe(
						value,
						record.collect((key, item) => \`\${key} \${item}\`),
						join(' '),
					),
				);
			}
			case 'pipeDelimited': {
				return right(
					pipe(
						value,
						record.collect((key, item) => \`\${key}|\${item}\`),
						join('|'),
					),
				);
			}
			case 'deepObject': {
				return right(
					pipe(
						value,
						record.collect((key, item) => \`\${name}[\${key}]=\${item}\`),
						join('&'),
					),
				);
			}
		}
		return left(new Error(\`Unsupported style "\${style}" for parameter "\${name}"\`));
	};
`;

export const openapi3utilsRef = fromString('#/utils/openapi-3-utils');
export const openapi3utilsFile = pipe(
	openapi3utilsRef,
	either.map(ref => fromRef(ref, '.ts', content)),
);
