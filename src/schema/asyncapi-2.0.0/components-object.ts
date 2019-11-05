import { Option } from 'fp-ts/lib/Option';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { SchemaObject, SchemaObjectCodec } from './schema-object';
import { MessageObject, MessageObjectCodec } from './message-object';
import { ParametersObject, ParametersObjectCodec } from './parameters-object';
import { CorrelationIdObject, CorrelationIdObjectCodec } from './correlation-id-object';
import { OperationTraitObject, OperationTraitObjectCodec } from './operation-trait-object';
import { MessageTraitObject, MessageTraitObjectCodec } from './message-trait-object';
import { brand, Branded, record, string, type, union } from 'io-ts';
import { Codec } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { SecuritySchemeObject, SecuritySchemeObjectCodec } from './security-scheme-object';

export interface ComponentsObjectFieldPatternBrand {
	readonly ComponentsObjectFieldPattern: unique symbol;
}
export type ComponentsObjectFieldPattern = Branded<string, ComponentsObjectFieldPatternBrand>;
const pattern = /^[a-zA-Z0-9.\-_]+$/;
const ComponentsObjectFieldPatternCodec: Codec<ComponentsObjectFieldPattern> = brand(
	string,
	(s): s is ComponentsObjectFieldPattern => pattern.test(s),
	'ComponentsObjectFieldPattern',
);

export interface ComponentsObject {
	readonly schemas: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | SchemaObject>>;
	readonly messages: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | MessageObject>>;
	readonly securitySchemes: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | SecuritySchemeObject>>;
	readonly parameters: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | ParametersObject>>;
	readonly correlationIds: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | CorrelationIdObject>>;
	readonly operationTraits: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | OperationTraitObject>>;
	readonly messageTraits: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | MessageTraitObject>>;
}

export const ComponentsObjectCodec: Codec<ComponentsObject> = type(
	{
		schemas: optionFromNullable(
			record(ComponentsObjectFieldPatternCodec, union([ReferenceObjectCodec, SchemaObjectCodec])),
		),
		messages: optionFromNullable(
			record(ComponentsObjectFieldPatternCodec, union([ReferenceObjectCodec, MessageObjectCodec])),
		),
		securitySchemes: optionFromNullable(
			record(ComponentsObjectFieldPatternCodec, union([ReferenceObjectCodec, SecuritySchemeObjectCodec])),
		),
		parameters: optionFromNullable(
			record(ComponentsObjectFieldPatternCodec, union([ReferenceObjectCodec, ParametersObjectCodec])),
		),
		correlationIds: optionFromNullable(
			record(ComponentsObjectFieldPatternCodec, union([ReferenceObjectCodec, CorrelationIdObjectCodec])),
		),
		operationTraits: optionFromNullable(
			record(ComponentsObjectFieldPatternCodec, union([ReferenceObjectCodec, OperationTraitObjectCodec])),
		),
		messageTraits: optionFromNullable(
			record(ComponentsObjectFieldPatternCodec, union([ReferenceObjectCodec, MessageTraitObjectCodec])),
		),
	},
	'ComponentsObjectCodec',
);
