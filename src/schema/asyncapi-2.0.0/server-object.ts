import { Option } from 'fp-ts/lib/Option';
import { ServerVariableObject, ServerVariableObjectCodec } from './server-variable-object';
import { SecurityRequirementObject, SecurityRequirementObjectCodec } from './security-requirement-object';
import { Codec } from '../../utils/io-ts';
import { array, record, string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ServerObject {
	readonly url: string;
	readonly protocol: string;
	readonly protocolVersion: Option<string>;
	readonly description: Option<string>;
	readonly variables: Option<Record<string, ServerVariableObject>>;
	readonly security: Option<SecurityRequirementObject[]>;
}

export const ServerObjectCodec: Codec<ServerObject> = type(
	{
		url: string,
		protocol: string,
		protocolVersion: optionFromNullable(string),
		description: optionFromNullable(string),
		variables: optionFromNullable(record(string, ServerVariableObjectCodec)),
		security: optionFromNullable(array(SecurityRequirementObjectCodec)),
	},
	'ServerObject',
);
