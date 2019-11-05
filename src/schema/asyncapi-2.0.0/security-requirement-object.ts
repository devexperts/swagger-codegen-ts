import { record, string } from 'io-ts';
import { Codec } from '../../utils/io-ts';

export interface SecurityRequirementObject extends Record<string, string> {}

export const SecurityRequirementObjectCodec: Codec<SecurityRequirementObject> = record(
	string,
	string,
	'SecurityRequirementObject',
);
