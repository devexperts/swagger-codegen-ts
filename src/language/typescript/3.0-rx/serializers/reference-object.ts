import { ReferenceObject } from '../../../../schema/2.0/reference-object';
import { Either, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { getRefTargetName } from '../utils';
import { dependency, SerializedDependency } from '../../common/data/serialized-dependency';
import { either } from 'fp-ts';
import { SerializedType } from '../../common/data/serialized-type';

export const isReferenceObject = <A>(object: ReferenceObject | A): object is ReferenceObject => (object as any)['$ref'];
export const addReferenceDependencies: (
	schema: unknown,
) => <S extends SerializedType>(serialized: S) => Either<Error, S> = schema =>
	isReferenceObject(schema)
		? serialized =>
				pipe(
					getReferenceDependencies(schema),
					either.map(dependencies => ({
						...serialized,
						dependencies: serialized.dependencies.concat(dependencies),
					})),
				)
		: right;

const getReferenceDependencies = (referenceObject: ReferenceObject): Either<Error, SerializedDependency[]> => {
	return pipe(
		getRefTargetName(referenceObject.$ref),
		either.fromNullable(new Error(`Unable to parse "${referenceObject.$ref}"`)),
		either.map(name => [dependency(name, 'unknown')]),
	);
};
