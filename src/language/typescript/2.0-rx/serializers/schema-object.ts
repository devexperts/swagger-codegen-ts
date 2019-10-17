import { foldSerializedTypes, serializedType, SerializedType } from '../../common/data/serialized-type';
import {
	serializedDependency,
	EMPTY_DEPENDENCIES,
	monoidDependencies,
	OPTION_DEPENDENCIES,
} from '../../common/data/serialized-dependency';
import { getRelativeOutRefPath, getRelativeRefPath } from '../utils';
import { SchemaObject } from '../../../../schema/2.0/schema-object/schema-object';
import {
	alt,
	chain,
	fromNullable,
	getOrElse,
	isNone,
	isSome,
	map,
	mapNullable,
	none,
	Option,
	some,
} from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold, monoidString } from 'fp-ts/lib/Monoid';
import { intercalate } from 'fp-ts/lib/Foldable';
import { array, getMonoid } from 'fp-ts/lib/Array';
import { serializeDictionary } from '../../../../utils/types';
import { constFalse } from 'fp-ts/lib/function';
import { concatIf, concatIfL } from '../../../../utils/array';
import { ReferenceSchemaObject } from '../../../../schema/2.0/schema-object/reference-schema-object';
import { AllOfSchemaObject } from '../../../../schema/2.0/schema-object/all-of-schema-object';
import { camelize } from '@devexperts/utils/dist/string';
import { getIOName, getRelativeUtilsPath } from '../../common/utils';
import { Ref, fromString } from '../../../../utils/ref';
import { isLeft } from 'fp-ts/lib/Either';

export const serializeSchemaObject = (schema: SchemaObject, rootName: string, cwd: string): SerializedType => {
	switch (schema.type) {
		case undefined: {
			if (is$ref(schema)) {
				const $ref = schema.$ref;
				const parts = fromNullable($ref.match(/^((.+)\/(.+)\.(.+))?#\/(.+)\/(.+)$/));

				const refFileName = pipe(
					parts,
					mapNullable(parts => parts[3]),
				);
				const defBlock = pipe(
					parts,
					mapNullable(parts => parts[5]),
				);
				const safeType = pipe(
					parts,
					mapNullable(parts => parts[6]),
				);

				const parsedRef = fromString(schema.$ref);
				if (isNone(safeType) || isNone(defBlock) || isLeft(parsedRef)) {
					throw new Error(`Invalid $ref: ${$ref}`);
				}

				const type = safeType.value;

				const io = getIOName(type);
				const isRecursive = isNone(refFileName) && (rootName === type || rootName === io);
				const definitionFilePath = isSome(refFileName)
					? getRelativeOutRefPath(cwd, defBlock.value, refFileName.value, type)
					: getRelativeRefPath(cwd, defBlock.value, type);

				const isSameOuterName = rootName === type && isSome(refFileName);
				const defName = getDefIFSameName(
					isSameOuterName,
					pipe(
						refFileName,
						getOrElse(() => ''),
					),
				);
				const asDefName = importAsFile(
					isSameOuterName,
					pipe(
						refFileName,
						getOrElse(() => ''),
					),
				);

				return serializedType(
					defName(type),
					defName(io),
					isRecursive
						? EMPTY_DEPENDENCIES
						: [
								serializedDependency(asDefName(type), definitionFilePath),
								serializedDependency(asDefName(io), definitionFilePath),
						  ],
					[parsedRef.right],
				);
			}

			const results = schema.allOf.map(item => serializeSchemaObject(item, rootName, cwd));
			const types = results.map(item => item.type);
			const ios = results.map(item => item.io);
			const dependencies = fold(monoidDependencies)(results.map(item => item.dependencies));
			const refs = fold(getMonoid<Ref>())(results.map(item => item.refs));

			return serializedType(
				intercalate(monoidString, array)(' & ', types),
				`intersection([${intercalate(monoidString, array)(', ', ios)}])`,
				[serializedDependency('intersection', 'io-ts'), ...dependencies],
				refs,
			);
		}
		case 'string': {
			return pipe(
				schema.enum,
				map(serializeEnum),
				alt(() =>
					pipe(
						schema.format,
						chain(format => {
							switch (format) {
								case 'date-time': {
									return some(
										serializedType(
											'Date',
											'DateFromISOString',
											[
												serializedDependency(
													'DateFromISOString',
													'io-ts-types/lib/DateFromISOString',
												),
											],
											[],
										),
									);
								}
							}
							return none;
						}),
					),
				),
				getOrElse(() => serializedType('string', 'string', [serializedDependency('string', 'io-ts')], [])),
			);
		}
		case 'boolean': {
			return serializedType('boolean', 'boolean', [serializedDependency('boolean', 'io-ts')], []);
		}
		case 'integer':
		case 'number': {
			return serializedType('number', 'number', [serializedDependency('number', 'io-ts')], []);
		}
		case 'array': {
			const result = serializeSchemaObject(schema.items, rootName, cwd);
			return serializedType(
				`Array<${result.type}>`,
				`array(${result.io})`,
				[...result.dependencies, serializedDependency('array', 'io-ts')],
				result.refs,
			);
		}
		case 'object': {
			return pipe(
				schema.additionalProperties,
				map(additionalProperties => serializeAdditionalProperties(additionalProperties, rootName, cwd)),
				alt(() =>
					pipe(
						schema.properties,
						map(properties => {
							const serialized = foldSerializedTypes(
								serializeDictionary(properties, (name, value) => {
									const isRequired = pipe(
										schema.required,
										map(required => required.includes(name)),
										getOrElse(constFalse),
									);
									const field = serializeSchemaObject(value, rootName, cwd);
									const type = isRequired
										? `${name}: ${field.type}`
										: `${name}: Option<${field.type}>`;
									const io = isRequired
										? `${name}: ${field.io}`
										: `${name}: optionFromNullable(${field.io})`;
									return serializedType(
										`${type};`,
										`${io},`,
										concatIf(!isRequired, field.dependencies, OPTION_DEPENDENCIES),
										field.refs,
									);
								}),
							);
							return toObjectType(
								serialized,
								serialized.refs.some(ref => ref.name === rootName) ? some(rootName) : none,
							);
						}),
					),
				),
				getOrElse(() =>
					serializedType(
						'unknown',
						'unknownType',
						[serializedDependency('unknownType', getRelativeUtilsPath(cwd))],
						[],
					),
				),
			);
		}
	}
};

const toObjectType = (serialized: SerializedType, recursion: Option<string>): SerializedType => {
	const io = `type({ ${serialized.io} })`;
	return serializedType(
		`{ ${serialized.type} }`,
		pipe(
			recursion,
			map(recursion => {
				const recursionIO = getIOName(recursion);
				return `recursion<${recursion}, unknown>('${recursionIO}', ${recursionIO} => ${io})`;
			}),
			getOrElse(() => io),
		),
		concatIfL(isSome(recursion), [...serialized.dependencies, serializedDependency('type', 'io-ts')], () => [
			serializedDependency('recursion', 'io-ts'),
		]),
		[],
	);
};

const serializeEnum = (enumValue: Array<string | number | boolean>): SerializedType => {
	const type = enumValue.map(value => `'${value}'`).join(' | ');
	const io =
		enumValue.length === 1
			? `literal(${type})`
			: `union([${enumValue.map(value => `literal('${value}')`).join(',')}])`;
	return serializedType(
		type,
		io,
		[serializedDependency('union', 'io-ts'), serializedDependency('literal', 'io-ts')],
		[],
	);
};

const serializeAdditionalProperties = (properties: SchemaObject, rootName: string, cwd: string): SerializedType => {
	const additional = serializeSchemaObject(properties, rootName, cwd);
	return serializedType(
		`{ [key: string]: ${additional.type} }`,
		`dictionary(string, ${additional.io})`,
		[
			...additional.dependencies,
			serializedDependency('string', 'io-ts'),
			serializedDependency('dictionary', 'io-ts'),
		],
		additional.refs,
	);
};

const getDefName = (name: string, prefix: string): string => `${camelize(prefix, true)}${name}`;
const getDefIFSameName = (isSameOutName: boolean, prefix: string) => (name: string): string =>
	!isSameOutName ? name : getDefName(name, prefix);
const importAsFile = (isSameOutName: boolean, prefix: string) => (name: string) =>
	!isSameOutName ? name : `${name} as ${getDefName(name, prefix)}`;

const is$ref = (a: ReferenceSchemaObject | AllOfSchemaObject): a is ReferenceSchemaObject =>
	Object.prototype.hasOwnProperty.bind(a)('$ref');
