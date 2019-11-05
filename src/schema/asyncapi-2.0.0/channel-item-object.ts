import { Option } from 'fp-ts/lib/Option';
import { OperationObject, OperationObjectCodec } from './operation-object';
import { ParametersObject, ParametersObjectCodec } from './parameters-object';
import { Codec } from '../../utils/io-ts';
import { string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ChannelBindingsObject, ChannelBindingsObjectCodec } from './channel-bindings-object';

export interface ChannelItemObject {
	readonly $ref: Option<string>;
	readonly description: Option<string>;
	readonly subscribe: Option<OperationObject>;
	readonly publish: Option<OperationObject>;
	readonly parameters: Option<ParametersObject>;
	readonly bindings: Option<ChannelBindingsObject>;
}

export const ChannelItemObjectCodec: Codec<ChannelItemObject> = type(
	{
		$ref: optionFromNullable(string),
		description: optionFromNullable(string),
		subscribe: optionFromNullable(OperationObjectCodec),
		publish: optionFromNullable(OperationObjectCodec),
		parameters: optionFromNullable(ParametersObjectCodec),
		bindings: optionFromNullable(ChannelBindingsObjectCodec),
	},
	'ChannelItemObject',
);
