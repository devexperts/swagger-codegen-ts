import { brand, Branded, record, string, union } from 'io-ts';
import { Codec } from '../../utils/io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { ParameterObject, ParameterObjectCodec } from './parameter-object';

export interface ParametersObjectFieldPatternBrand {
	readonly ParametersObjectFieldPattern: unique symbol;
}
export type ParametersObjectPattern = Branded<string, ParametersObjectFieldPatternBrand>;

const pattern = /^[A-Za-z0-9_\-]+$/;
const ParametersObjectFieldPatternCodec = brand(
	string,
	(v): v is ParametersObjectPattern => pattern.test(v),
	'ParametersObjectFieldPattern',
);

export interface ParametersObject extends Record<ParametersObjectPattern, ReferenceObject | ParameterObject> {}

export const ParametersObjectCodec: Codec<ParametersObject> = record(
	ParametersObjectFieldPatternCodec,
	union([ReferenceObjectCodec, ParameterObjectCodec]),
	'ParametersObject',
);
