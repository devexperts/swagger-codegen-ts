import * as t from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export const stringOption = optionFromNullable(t.string);
export const booleanOption = optionFromNullable(t.boolean);
export const numberOption = optionFromNullable(t.number);
export const stringArrayOption = optionFromNullable(t.array(t.string));
export const primitiveArrayOption = optionFromNullable(t.array(t.union([t.string, t.boolean, t.number])));

export interface Dictionary<A> extends Readonly<Record<string, A>> {}

export interface ContactObject {
	readonly name: Option<string>;
	readonly url: Option<string>;
	readonly email: Option<string>;
}
export const ContactObject = t.type(
	{
		name: stringOption,
		url: stringOption,
		email: stringOption,
	},
	'ContactObject',
);

export interface LicenseObject {
	readonly name: string;
	readonly url: Option<string>;
}

export const LicenseObject = t.type(
	{
		name: t.string,
		url: stringOption,
	},
	'LicenseObject',
);

export interface InfoObject {
	readonly title: string;
	readonly description: Option<string>;
	readonly termsOfService: Option<string>;
	readonly contact: Option<ContactObject>;
	readonly license: Option<LicenseObject>;
	readonly version: string;
}

export const InfoObject = t.type(
	{
		title: t.string,
		description: stringOption,
		termsOfService: stringOption,
		contact: optionFromNullable(ContactObject),
		license: optionFromNullable(LicenseObject),
		version: t.string,
	},
	'InfoObject',
);

export interface ExternalDocumentationObject {
	readonly description: Option<string>;
	readonly url: string;
}

export const ExternalDocumentationObject = t.type(
	{
		description: stringOption,
		url: t.string,
	},
	'ExternalDocumentationObject',
);

export interface ReferenceObject {
	readonly $ref: string;
}

export const ReferenceObject = t.type(
	{
		$ref: t.string,
	},
	'ReferenceObject',
);

//#region Schema Object

export interface ObjectSchemaObject {
	readonly type: 'object';
	readonly properties: Option<Dictionary<SchemaObject>>;
	readonly required: Option<string[]>;
	readonly additionalProperties: Option<SchemaObject>;
}

export interface StringPropertySchemaObject {
	readonly type: 'string';
	readonly format: Option<string>;
	readonly enum: Option<Array<string | number | boolean>>;
}

export const StringPropertySchemaObject = t.type(
	{
		type: t.literal('string'),
		format: stringOption,
		enum: primitiveArrayOption,
	},
	'StringPropertySchemaObject',
);

export interface NumberPropertySchemaObject {
	readonly type: 'number';
	readonly format: Option<string>;
}

export const NumberPropertySchemaObject = t.type(
	{
		type: t.literal('number'),
		format: stringOption,
	},
	'NumberPropertySchemaObject',
);

export interface IntegerPropertySchemaObject {
	readonly type: 'integer';
	readonly format: Option<string>;
}

export const IntegerPropertySchemaObject = t.type(
	{
		type: t.literal('integer'),
		format: stringOption,
	},
	'IntegerPropertySchemaObject',
);

export interface BooleanPropertySchemaObject {
	readonly type: 'boolean';
}

export const BooleanPropertySchemaObject = t.type(
	{
		type: t.literal('boolean'),
	},
	'BooleanPropertySchemaObject',
);

export interface AllOfSchemaObject {
	readonly allOf: SchemaObject[];
	readonly description: Option<string>;
	readonly type: undefined;
}

export interface ReferenceSchemaObject extends ReferenceObject {
	readonly type: undefined;
}

export type ReferenceOrAllOfSchemeObject = ReferenceSchemaObject | AllOfSchemaObject;

export interface ArraySchemaObject {
	readonly type: 'array';
	readonly items: SchemaObject;
}

export type SchemaObject =
	| ReferenceOrAllOfSchemeObject
	| ObjectSchemaObject
	| StringPropertySchemaObject
	| NumberPropertySchemaObject
	| IntegerPropertySchemaObject
	| BooleanPropertySchemaObject
	| ArraySchemaObject;
export const SchemaObject = t.recursion<SchemaObject, unknown>('SchemaObject', SchemaObject => {
	const ArraySchemaObject = t.type({
		type: t.literal('array'),
		items: SchemaObject,
	});
	const ObjectSchemaObject = t.type({
		required: stringArrayOption,
		type: t.literal('object'),
		properties: optionFromNullable(t.record(t.string, SchemaObject, 'Dictionary<SchemaObject>')),
		additionalProperties: optionFromNullable(SchemaObject),
	});
	const ReferenceOrAllOfSchemaObject = t.union([
		t.intersection([
			ReferenceObject,
			t.type({
				type: t.literal(undefined as any),
			}),
		]),
		t.type({
			description: stringOption,
			type: t.literal(undefined as any),
			allOf: t.array(SchemaObject),
		}),
	]);

	return t.union([
		ReferenceOrAllOfSchemaObject,
		ArraySchemaObject,
		ObjectSchemaObject,
		StringPropertySchemaObject,
		NumberPropertySchemaObject,
		IntegerPropertySchemaObject,
		BooleanPropertySchemaObject,
	]);
});

//#endregion

export interface DefinitionsObject extends Dictionary<SchemaObject> {}
export const DefinitionsObject = t.record(t.string, SchemaObject, 'DefinitionsObject');

//#region Items Object

export interface BaseItemsObject {
	readonly format: Option<string>;
	readonly collectionFormat: Option<'csv' | 'ssv' | 'tsv' | 'pipes'>;
	readonly maximum: Option<number>;
	readonly exclusiveMaximum: Option<boolean>;
	readonly minimum: Option<number>;
	readonly exclusiveMinimum: Option<boolean>;
	readonly maxLength: Option<number>;
	readonly minLength: Option<number>;
	readonly pattern: Option<string>;
	readonly maxItems: Option<number>;
	readonly minItems: Option<number>;
	readonly uniqueItems: Option<boolean>;
	readonly enum: Option<Array<string | number | boolean>>;
	readonly multipleOf: Option<number>;
}

export const BaseItemsObjectProps = {
	format: stringOption,
	collectionFormat: optionFromNullable(
		t.union([t.literal('csv'), t.literal('ssv'), t.literal('tsv'), t.literal('pipes')]),
	),
	maximum: numberOption,
	exclusiveMaximum: booleanOption,
	minimum: numberOption,
	exclusiveMinimum: booleanOption,
	maxLength: numberOption,
	minLength: numberOption,
	pattern: stringOption,
	maxItems: numberOption,
	minItems: numberOption,
	uniqueItems: booleanOption,
	enum: primitiveArrayOption,
	multipleOf: numberOption,
};

export interface StringItemsObject extends BaseItemsObject {
	readonly type: 'string';
}
export const StringItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('string'),
	},
	'StringItemsObject',
);

export interface NumberItemsObject extends BaseItemsObject {
	readonly type: 'number';
}
export const NumberItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('number'),
	},
	'NumberItemsObject',
);

export interface IntegerItemsObject extends BaseItemsObject {
	readonly type: 'integer';
}
export const IntegerItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('integer'),
	},
	'IntegerItemsObject',
);

export interface BooleanItemsObject extends BaseItemsObject {
	readonly type: 'boolean';
}
export const BooleanItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('boolean'),
	},
	'BooleanItemsObject',
);

export interface ArrayItemsObject extends BaseItemsObject {
	readonly type: 'array';
	readonly items: Option<ItemsObject[]>;
}

export type ItemsObject =
	| ArrayItemsObject
	| StringItemsObject
	| NumberItemsObject
	| IntegerItemsObject
	| BooleanItemsObject;
export const ItemsObject = t.recursion<ItemsObject>('ItemsObject', ItemsObject => {
	const ArrayItemsObject = t.type({
		...BaseItemsObjectProps,
		type: t.literal('array'),
		items: optionFromNullable(t.array(ItemsObject)),
	});
	return t.union([
		ArrayItemsObject,
		StringItemsObject,
		NumberItemsObject,
		IntegerItemsObject,
		BooleanItemsObject,
	]) as any;
});

export type NonArrayItemsObject = StringItemsObject | NumberItemsObject | IntegerItemsObject | BooleanItemsObject;
export const NonArrayItemsObject = t.union(
	[StringItemsObject, NumberItemsObject, IntegerItemsObject, BooleanItemsObject],
	'NonArrayItemsObject',
);

//#endregion

export interface BaseParameterObjectProps {
	readonly name: string;
	readonly description: Option<string>;
}
const BaseParameterObjectProps = {
	name: t.string,
	description: stringOption,
};

//#region Path Parameter Object

export interface BasePathParameterObjectProps extends BaseParameterObjectProps {
	readonly in: 'path';
	readonly required: true;
	readonly format: Option<string>;
}
const BasePathParameterObjectProps = {
	...BaseParameterObjectProps,
	in: t.literal('path'),
	required: t.literal(true),
	format: stringOption,
};

export interface StringPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'string';
}
const StringPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('string'),
	},
	'StringPathParameterObject',
);

export interface NumberPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'number';
}
const NumberPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('number'),
	},
	'NumberPathParameterObject',
);

export interface IntegerPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'integer';
}
const IntegerPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('integer'),
	},
	'IntegerPathParameterObject',
);

export interface BooleanPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'boolean';
}
const BooleanPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('boolean'),
	},
	'BooleanPathParameterObject',
);

export interface ArrayPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'array';
	readonly items: NonArrayItemsObject;
}
const ArrayPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('array'),
		items: NonArrayItemsObject,
	},
	'ArrayPathParameterObject',
);

export type PathParameterObject =
	| StringPathParameterObject
	| NumberPathParameterObject
	| IntegerPathParameterObject
	| BooleanPathParameterObject
	| ArrayPathParameterObject;

export const PathParameterObject = t.union(
	[
		StringPathParameterObject,
		NumberPathParameterObject,
		IntegerPathParameterObject,
		BooleanPathParameterObject,
		ArrayPathParameterObject,
	],
	'PathParameterObject',
);

//#endregion

//#region Query Parameter Object

export interface BaseQueryParameterObjectProps {
	readonly name: string;
	readonly in: 'query';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}

const BaseQueryParameterObjectProps = {
	name: t.string,
	in: t.literal('query'),
	description: stringOption,
	required: booleanOption,
};

export interface StringQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'string';
}
const StringQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('string'),
	},
	'StringQueryParameterObject',
);

export interface NumberQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'number';
}
const NumberQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('number'),
	},
	'NumberQueryParameterObject',
);

export interface IntegerQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'integer';
}
const IntegerQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('integer'),
	},
	'IntegerQueryParameterObject',
);

export interface BooleanQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'boolean';
}
const BooleanQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('boolean'),
	},
	'BooleanQueryParameterObject',
);

export interface ArrayQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'array';
	readonly items: NonArrayItemsObject;
}
const ArrayQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('array'),
		items: NonArrayItemsObject,
	},
	'ArrayQueryParameterObject',
);

export type QueryParameterObject =
	| StringQueryParameterObject
	| NumberQueryParameterObject
	| IntegerQueryParameterObject
	| BooleanQueryParameterObject
	| ArrayQueryParameterObject;

export const QueryParameterObject = t.union(
	[
		StringQueryParameterObject,
		NumberQueryParameterObject,
		IntegerQueryParameterObject,
		BooleanQueryParameterObject,
		ArrayQueryParameterObject,
	],
	'QueryParameterObject',
);

//#endregion

export interface HeaderParameterObject {
	readonly name: string;
	readonly in: 'header';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}

export const HeaderParameterObject = t.type(
	{
		name: t.string,
		in: t.literal('header'),
		description: stringOption,
		required: booleanOption,
	},
	'HeaderParameterObject',
);
export interface FormDataParameterObject {
	readonly name: string;
	readonly in: 'formData';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}
export const FormDataParameterObject = t.type(
	{
		name: t.string,
		in: t.literal('formData'),
		description: stringOption,
		required: booleanOption,
	},
	'FormDataParameterObject',
);

//#region Body Parameter Object

export interface BodyParameterObject extends BaseParameterObjectProps {
	readonly in: 'body';
	readonly required: Option<boolean>;
	readonly schema: SchemaObject;
}

export const BodyParameterObject = t.type(
	{
		...BaseParameterObjectProps,
		in: t.literal('body'),
		required: booleanOption,
		schema: SchemaObject,
	},
	'BodyParameterObject',
);

//#endregion

export type ParameterObject =
	| PathParameterObject
	| QueryParameterObject
	| HeaderParameterObject
	| FormDataParameterObject
	| BodyParameterObject;
export const ParameterObject = t.union(
	[PathParameterObject, QueryParameterObject, HeaderParameterObject, FormDataParameterObject, BodyParameterObject],
	'ParameterObject',
);

export interface ExampleObject extends Dictionary<string> {}
export const ExampleObject = t.record(t.string, t.string, 'ExampleObject');

export type HeaderObject = ItemsObject & {
	readonly description: Option<string>;
};
export const HeaderObject = t.intersection(
	[
		ItemsObject,
		t.type({
			description: stringOption,
		}),
	],
	'HeaderObject',
);

export interface HeadersObject extends Dictionary<HeaderObject> {}
export const HeadersObject = t.record(t.string, HeaderObject, 'HeadersObject');

export interface ResponseObject {
	readonly description: string;
	readonly schema: Option<SchemaObject>;
	readonly headers: Option<HeadersObject>;
	readonly examples: Option<ExampleObject>;
}
export const ResponseObject = t.type(
	{
		description: t.string,
		schema: optionFromNullable(SchemaObject),
		headers: optionFromNullable(HeadersObject),
		examples: optionFromNullable(ExampleObject),
	},
	'ResponseObject',
);

export interface ResponsesObject extends Dictionary<ResponseObject> {}
export const ResponsesObject = t.record(t.string, ResponseObject, 'ResponsesObject');

export interface SecurityRequirementObject extends Dictionary<string[]> {}
export const SecurityRequirementObject = t.record(t.string, t.array(t.string), 'SecurityRequirementObject');

export interface OperationObject {
	readonly tags: Option<string[]>;
	readonly summary: Option<string>;
	readonly description: Option<string>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
	readonly operationId: Option<string>;
	readonly consumes: Option<string[]>;
	readonly produces: Option<string[]>;
	readonly parameters: Option<Array<ParameterObject | ReferenceObject>>;
	readonly responses: ResponsesObject;
	readonly schemes: Option<string[]>;
	readonly deprecated: Option<boolean>;
	readonly security: Option<SecurityRequirementObject[]>;
}

export const OperationObject = t.type(
	{
		tags: stringArrayOption,
		summary: stringOption,
		description: stringOption,
		externalDocs: optionFromNullable(ExternalDocumentationObject),
		operationId: stringOption,
		consumes: stringArrayOption,
		produces: stringArrayOption,
		parameters: optionFromNullable(t.array(t.union([ParameterObject, ReferenceObject]))),
		responses: ResponsesObject,
		schemes: stringArrayOption,
		deprecated: booleanOption,
		security: optionFromNullable(t.array(SecurityRequirementObject)),
	},
	'OperationObject',
);

export interface PathItemObject {
	readonly $ref: Option<string>;
	readonly get: Option<OperationObject>;
	readonly put: Option<OperationObject>;
	readonly post: Option<OperationObject>;
	readonly delete: Option<OperationObject>;
	readonly options: Option<OperationObject>;
	readonly head: Option<OperationObject>;
	readonly patch: Option<OperationObject>;
	readonly parameters: Option<Array<ParameterObject | ReferenceObject>>;
}
export const PathItemObject = t.type(
	{
		$ref: stringOption,
		get: optionFromNullable(OperationObject),
		put: optionFromNullable(OperationObject),
		post: optionFromNullable(OperationObject),
		delete: optionFromNullable(OperationObject),
		options: optionFromNullable(OperationObject),
		head: optionFromNullable(OperationObject),
		patch: optionFromNullable(OperationObject),
		parameters: optionFromNullable(t.array(t.union([ParameterObject, ReferenceObject]))),
	},
	'PathItemObject',
);

export interface PathsObject extends Dictionary<PathItemObject> {}
export const PathsObject = t.record(t.string, PathItemObject, 'PathsObject');

export interface ParametersDefinitionsObject extends Dictionary<ParameterObject> {}
export const ParametersDefinitionsObject = t.record(t.string, ParameterObject, 'ParametersDefinitionsObject');

export interface ResponsesDefinitionsObject extends Dictionary<ResponseObject> {}
export const ResponsesDefinitionsObject = t.record(t.string, ResponseObject, 'ResponsesDefinitionsObject');

export interface ScopesObject extends Dictionary<string> {}
export const ScopesObject = t.record(t.string, t.string, 'ScopesObject');

//#region SecuritySchemeObject

export interface BaseSecuritySchemeObjectProps {
	readonly description: Option<string>;
}

const BaseSecuritySchemeObjectProps = {
	description: stringOption,
};

export interface BasicSecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'basic';
}
const BasicSecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('basic'),
	},
	'BasicSecuritySchemeObject',
);

export interface ApiKeySecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'apiKey';
	readonly in: 'query' | 'header';
	readonly name: string;
}
const ApiKeySecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('apiKey'),
		in: t.union([t.literal('query'), t.literal('header')]),
		name: t.string,
	},
	'ApiKeySecuritySchemeObject',
);

export interface ImplicitOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'implicit';
	readonly authorizationUrl: string;
	readonly scopes: ScopesObject;
}
const ImplicitOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('implicit'),
		authorizationUrl: t.string,
		scopes: ScopesObject,
	},
	'ImplicitOAuth2SecuritySchemeObject',
);
export interface PasswordOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'password';
	readonly tokenUrl: string;
	readonly scopes: ScopesObject;
}
const PasswordOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('password'),
		tokenUrl: t.string,
		scopes: ScopesObject,
	},
	'PasswordOAuth2SecuritySchemeObject',
);
export interface ApplicationOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'application';
	readonly tokenUrl: string;
	readonly scopes: ScopesObject;
}
const ApplicationOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('application'),
		tokenUrl: t.string,
		scopes: ScopesObject,
	},
	'ApplicationOAuth2SecuritySchemeObject',
);
export interface AccessCodeOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'accessCode';
	readonly tokenUrl: string;
	readonly scopes: ScopesObject;
}
const AccessCodeOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('accessCode'),
		tokenUrl: t.string,
		scopes: ScopesObject,
	},
	'AccessCodeOAuth2SecuritySchemeObject',
);
export type OAuth2SecuritySchemeObject =
	| ImplicitOAuth2SecuritySchemeObject
	| PasswordOAuth2SecuritySchemeObject
	| ApplicationOAuth2SecuritySchemeObject
	| AccessCodeOAuth2SecuritySchemeObject;
const OAuth2SecuritySchemeObject = t.union(
	[
		ImplicitOAuth2SecuritySchemeObject,
		PasswordOAuth2SecuritySchemeObject,
		ApplicationOAuth2SecuritySchemeObject,
		AccessCodeOAuth2SecuritySchemeObject,
	],
	'OAuth2SecuritySchemeObject',
);

export type SecuritySchemeObject = BasicSecuritySchemeObject | ApiKeySecuritySchemeObject | OAuth2SecuritySchemeObject;
const SecuritySchemeObject = t.union(
	[BasicSecuritySchemeObject, ApiKeySecuritySchemeObject, OAuth2SecuritySchemeObject],
	'SecuritySchemeObject',
);

//#endregion

export interface SecurityDefinitionsObject extends Dictionary<SecuritySchemeObject> {}
export const SecurityDefinitionsObject = t.record(t.string, SecuritySchemeObject, 'SecurityDefinitionsObject');

export interface TagObject {
	readonly name: string;
	readonly description: Option<string>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
}

export const TagObject = t.type(
	{
		name: t.string,
		description: stringOption,
		externalDocs: optionFromNullable(ExternalDocumentationObject),
	},
	'TagObject',
);

export interface SwaggerObject {
	readonly basePath: Option<string>;
	readonly consumes: Option<string[]>;
	readonly definitions: Option<DefinitionsObject>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
	readonly host: Option<string>;
	readonly info: InfoObject;
	readonly parameters: Option<ParametersDefinitionsObject>;
	readonly paths: PathsObject;
	readonly produces: Option<string[]>;
	readonly responses: Option<ResponsesDefinitionsObject>;
	readonly schemes: Option<string[]>;
	readonly security: Option<SecurityRequirementObject[]>;
	readonly securityDefinitions: Option<SecurityDefinitionsObject>;
	readonly swagger: string;
	readonly tags: Option<TagObject[]>;
}

export const SwaggerObject = t.type(
	{
		basePath: stringOption,
		consumes: stringArrayOption,
		definitions: optionFromNullable(DefinitionsObject),
		externalDocs: optionFromNullable(ExternalDocumentationObject),
		host: stringOption,
		info: InfoObject,
		parameters: optionFromNullable(ParametersDefinitionsObject),
		paths: PathsObject,
		produces: stringArrayOption,
		responses: optionFromNullable(ResponsesDefinitionsObject),
		schemes: stringArrayOption,
		security: optionFromNullable(t.array(SecurityRequirementObject)),
		securityDefinitions: optionFromNullable(SecurityDefinitionsObject),
		swagger: t.string,
		tags: optionFromNullable(t.array(TagObject)),
	},
	'SwaggerObject',
);
