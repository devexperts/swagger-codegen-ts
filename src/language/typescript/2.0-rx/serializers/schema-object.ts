import {
	foldSerializedTypes,
	SERIALIZED_UNKNOWN_TYPE,
	serializedType,
	SerializedType,
} from '../../common/data/serialized-type';
import {
	EMPTY_DEPENDENCIES,
	monoidDependencies,
	OPTION_DEPENDENCIES,
	serializedDependency,
} from '../../common/data/serialized-dependency';
import { getRelativeOutRefPath, getRelativeRefPath } from '../utils';
import { AllOfSchemaObject, SchemaObject } from '../../../../schema/2.0/schema-object/schema-object';
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
import { getMonoid } from 'fp-ts/lib/Array';
import { constFalse } from 'fp-ts/lib/function';
import { concatIf, concatIfL } from '../../../../utils/array';
import { camelize } from '@devexperts/utils/dist/string';
import { getIOName } from '../../common/utils';
import { fromString, Ref } from '../../../../utils/ref';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { array, either, option, record } from 'fp-ts';
import { traverseArrayEither } from '../../../../utils/either';
import { ReferenceObject } from '../../../../schema/2.0/reference-object';

export const serializeSchemaObject = (
	schema: SchemaObject,
	rootName: string,
	cwd: string,
): Either<Error, SerializedType> => {
	// check non-typed schemas first
	if (ReferenceObject.is(schema)) {
		const $ref = schema.$ref;
		const parts = fromNullable($ref.match(/^((.+)\/(.+))?#\/(.+)\/(.+)$/));
		//											      2     3        4     5
		const parsedRef = fromString(schema.$ref);

		const refFileName = pipe(
			parts,
			mapNullable(parts => parts[3]),
		);
		const defBlock = pipe(
			parts,
			mapNullable(parts => parts[4]),
		);
		const safeType = pipe(
			parts,
			mapNullable(parts => parts[5]),
		);

		if (isNone(safeType) || isNone(defBlock) || isLeft(parsedRef)) {
			return left(new Error(`Invalid $ref: ${$ref}`));
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

		return right(
			serializedType(
				defName(type),
				defName(io),
				isRecursive
					? EMPTY_DEPENDENCIES
					: [
							serializedDependency(asDefName(type), definitionFilePath),
							serializedDependency(asDefName(io), definitionFilePath),
					  ],
				[parsedRef.right],
			),
		);
	}

	if (AllOfSchemaObject.is(schema)) {
		return pipe(
			traverseArrayEither(schema.allOf, item => serializeSchemaObject(item, rootName, cwd)),
			either.map(results => {
				const types = results.map(item => item.type);
				const ios = results.map(item => item.io);
				const dependencies = fold(monoidDependencies)(results.map(item => item.dependencies));
				const refs = fold(getMonoid<Ref>())(results.map(item => item.refs));

				return serializedType(
					intercalate(monoidString, array.array)(' & ', types),
					`intersection([${intercalate(monoidString, array.array)(', ', ios)}])`,
					[serializedDependency('intersection', 'io-ts'), ...dependencies],
					refs,
				);
			}),
		);
	}

	// schema is typed
	switch (schema.type) {
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
				right,
			);
		}
		case 'boolean': {
			return right(serializedType('boolean', 'boolean', [serializedDependency('boolean', 'io-ts')], []));
		}
		case 'integer':
		case 'number': {
			return right(serializedType('number', 'number', [serializedDependency('number', 'io-ts')], []));
		}
		case 'array': {
			return pipe(
				serializeSchemaObject(schema.items, rootName, cwd),
				either.map(result =>
					serializedType(
						`Array<${result.type}>`,
						`array(${result.io})`,
						[...result.dependencies, serializedDependency('array', 'io-ts')],
						result.refs,
					),
				),
			);
		}
		case 'object': {
			const additionalProperties = pipe(
				schema.additionalProperties,
				option.map(additionalProperties => serializeAdditionalProperties(additionalProperties, rootName, cwd)),
			);
			const properties = () =>
				pipe(
					schema.properties,
					option.map(properties =>
						pipe(
							properties,
							record.collect((name, value) => {
								const isRequired = pipe(
									schema.required,
									map(required => required.includes(name)),
									getOrElse(constFalse),
								);
								return pipe(
									serializeSchemaObject(value, rootName, cwd),
									either.map(field => {
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
							}),
							sequenceEither,
							either.map(foldSerializedTypes),
							either.map(serialized =>
								toObjectType(
									serialized,
									serialized.refs.some(ref => ref.name === rootName) ? some(rootName) : none,
								),
							),
						),
					),
				);

			return pipe(
				additionalProperties,
				option.alt(properties),
				getOrElse(() => right(SERIALIZED_UNKNOWN_TYPE)),
			);
		}
	}
	//
	// return left(new Error(`Cannot serialize SchemaObject`));
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

const serializeAdditionalProperties = (
	properties: SchemaObject,
	rootName: string,
	cwd: string,
): Either<Error, SerializedType> =>
	pipe(
		serializeSchemaObject(properties, rootName, cwd),
		either.map(additional =>
			serializedType(
				`{ [key: string]: ${additional.type} }`,
				`dictionary(string, ${additional.io})`,
				[
					...additional.dependencies,
					serializedDependency('string', 'io-ts'),
					serializedDependency('dictionary', 'io-ts'),
				],
				additional.refs,
			),
		),
	);

const getDefName = (name: string, prefix: string): string => `${camelize(prefix, true)}${name}`;
const getDefIFSameName = (isSameOutName: boolean, prefix: string) => (name: string): string =>
	!isSameOutName ? name : getDefName(name, prefix);
const importAsFile = (isSameOutName: boolean, prefix: string) => (name: string) =>
	!isSameOutName ? name : `${name} as ${getDefName(name, prefix)}`;
