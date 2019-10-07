import * as t from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export const stringOption = optionFromNullable(t.string);
export const booleanOption = optionFromNullable(t.boolean);
export const numberOption = optionFromNullable(t.number);
export const stringArrayOption = optionFromNullable(t.array(t.string));
export const primitiveArrayOption = optionFromNullable(t.array(t.union([t.string, t.boolean, t.number])));

export type TDictionary<A> = {
	[key: string]: A;
};

export type TContactObject = {
	name: Option<string>;
	url: Option<string>;
	email: Option<string>;
};
export const ContactObject = t.type(
	{
		name: stringOption,
		url: stringOption,
		email: stringOption,
	},
	'TContactObject',
);

export type TLicenseObject = {
	name: string;
	url: Option<string>;
};
export const LicenseObject = t.type(
	{
		name: t.string,
		url: stringOption,
	},
	'TLicenseObject',
);

export type TInfoObject = {
	title: string;
	description: Option<string>;
	termsOfService: Option<string>;
	contact: Option<TContactObject>;
	license: Option<TLicenseObject>;
	version: string;
};
export const InfoObject = t.type(
	{
		title: t.string,
		description: stringOption,
		termsOfService: stringOption,
		contact: optionFromNullable(ContactObject),
		license: optionFromNullable(LicenseObject),
		version: t.string,
	},
	'TInfoObject',
);

export type TExternalDocumentationObject = {
	description: Option<string>;
	url: string;
};
export const ExternalDocumentationObject = t.type(
	{
		description: stringOption,
		url: t.string,
	},
	'TExternalDocumentationObject',
);

export type TReferenceObject = {
	$ref: string;
};
export const ReferenceObject = t.type(
	{
		$ref: t.string,
	},
	'TReferenceObject',
);

//#region Schema Object

export type TObjectSchemaObject = {
	type: 'object';
	properties: Option<TDictionary<TSchemaObject>>;
	required: Option<string[]>;
	additionalProperties: Option<TSchemaObject>;
};

export type TStringPropertySchemaObject = {
	type: 'string';
	format: Option<string>;
	enum: Option<Array<string | number | boolean>>;
};
export const StringPropertySchemaObject = t.type(
	{
		type: t.literal('string'),
		format: stringOption,
		enum: primitiveArrayOption,
	},
	'TStringPropertySchemaObject',
);

export type TNumberPropertySchemaObject = {
	type: 'number';
	format: Option<string>;
};
export const NumberPropertySchemaObject = t.type(
	{
		type: t.literal('number'),
		format: stringOption,
	},
	'TNumberPropertySchemaObject',
);

export type TIntegerPropertySchemaObject = {
	type: 'integer';
	format: Option<string>;
};
export const IntegerPropertySchemaObject = t.type(
	{
		type: t.literal('integer'),
		format: stringOption,
	},
	'TIntegerPropertySchemaObject',
);

export type TBooleanPropertySchemaObject = {
	type: 'boolean';
};
export const BooleanPropertySchemaObject = t.type(
	{
		type: t.literal('boolean'),
	},
	'TBooleanPropertySchemaObject',
);

export type TAllOfSchemaObject = {
	allOf: TSchemaObject[];
	description: Option<string>;
	type: undefined;
};
export type TReferenceSchemaObject = TReferenceObject & {
	type: undefined;
};
export type TReferenceOrAllOfSchemeObject = TReferenceSchemaObject | TAllOfSchemaObject;

export type TArraySchemaObject = {
	type: 'array';
	items: TSchemaObject;
};

export type TSchemaObject =
	| TReferenceOrAllOfSchemeObject
	| TObjectSchemaObject
	| TStringPropertySchemaObject
	| TNumberPropertySchemaObject
	| TIntegerPropertySchemaObject
	| TBooleanPropertySchemaObject
	| TArraySchemaObject;
export const SchemaObject = t.recursion<TSchemaObject, unknown>('SchemaObject', SchemaObject => {
	const ArraySchemaObject = t.type({
		type: t.literal('array'),
		items: SchemaObject,
	});
	const ObjectSchemaObject = t.type({
		required: stringArrayOption,
		type: t.literal('object'),
		properties: optionFromNullable(t.record(t.string, SchemaObject, 'TDictionary<TSchemaObject>')),
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

export type TDefinitionsObject = TDictionary<TSchemaObject>;
export const DefinitionsObject = t.record(t.string, SchemaObject, 'TDefinitionsObject');

//#region Items Object

export type TBaseItemsObject = {
	format: Option<string>;
	collectionFormat: Option<'csv' | 'ssv' | 'tsv' | 'pipes'>;
	maximum: Option<number>;
	exclusiveMaximum: Option<boolean>;
	minimum: Option<number>;
	exclusiveMinimum: Option<boolean>;
	maxLength: Option<number>;
	minLength: Option<number>;
	pattern: Option<string>;
	maxItems: Option<number>;
	minItems: Option<number>;
	uniqueItems: Option<boolean>;
	enum: Option<Array<string | number | boolean>>;
	multipleOf: Option<number>;
};
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

export type TStringItemsObject = TBaseItemsObject & {
	type: 'string';
};
export const StringItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('string'),
	},
	'TStringItemsObject',
);

export type TNumberItemsObject = TBaseItemsObject & {
	type: 'number';
};
export const NumberItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('number'),
	},
	'TNumberItemsObject',
);

export type TIntegerItemsObject = TBaseItemsObject & {
	type: 'integer';
};
export const IntegerItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('integer'),
	},
	'TIntegerItemsObject',
);

export type TBooleanItemsObject = TBaseItemsObject & {
	type: 'boolean';
};
export const BooleanItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('boolean'),
	},
	'TBooleanItemsObject',
);

export type TArrayItemsObject = TBaseItemsObject & {
	type: 'array';
	items: Option<TItemsObject[]>;
};

export type TItemsObject =
	| TArrayItemsObject
	| TStringItemsObject
	| TNumberItemsObject
	| TIntegerItemsObject
	| TBooleanItemsObject;
export const ItemsObject = t.recursion<TItemsObject>('ItemsObject', ItemsObject => {
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

export type TNonArrayItemsObject = TStringItemsObject | TNumberItemsObject | TIntegerItemsObject | TBooleanItemsObject;
export const NonArrayItemsObject = t.union(
	[StringItemsObject, NumberItemsObject, IntegerItemsObject, BooleanItemsObject],
	'TNonArrayItemsObject',
);

//#endregion

export type TBaseParameterObjectProps = {
	name: string;
	description: Option<string>;
};
const BaseParameterObjectProps = {
	name: t.string,
	description: stringOption,
};

//#region Path Parameter Object

export type TBasePathParameterObjectProps = TBaseParameterObjectProps & {
	in: 'path';
	required: true;
	format: Option<string>;
};
const BasePathParameterObjectProps = {
	...BaseParameterObjectProps,
	in: t.literal('path'),
	required: t.literal(true),
	format: stringOption,
};

export type TStringPathParameterObject = TBasePathParameterObjectProps & {
	type: 'string';
};
const StringPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('string'),
	},
	'TStringPathParameterObject',
);

export type TNumberPathParameterObject = TBasePathParameterObjectProps & {
	type: 'number';
};
const NumberPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('number'),
	},
	'TNumberPathParameterObject',
);

export type TIntegerPathParameterObject = TBasePathParameterObjectProps & {
	type: 'integer';
};
const IntegerPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('integer'),
	},
	'TIntegerPathParameterObject',
);

export type TBooleanPathParameterObject = TBasePathParameterObjectProps & {
	type: 'boolean';
};
const BooleanPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('boolean'),
	},
	'TBooleanPathParameterObject',
);

export type TArrayPathParameterObject = TBasePathParameterObjectProps & {
	type: 'array';
	items: TNonArrayItemsObject;
};
const ArrayPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('array'),
		items: NonArrayItemsObject,
	},
	'TArrayPathParameterObject',
);

export type TPathParameterObject =
	| TStringPathParameterObject
	| TNumberPathParameterObject
	| TIntegerPathParameterObject
	| TBooleanPathParameterObject
	| TArrayPathParameterObject;

export const PathParameterObject = t.union(
	[
		StringPathParameterObject,
		NumberPathParameterObject,
		IntegerPathParameterObject,
		BooleanPathParameterObject,
		ArrayPathParameterObject,
	],
	'TPathParameterObject',
);

//#endregion

//#region Query Parameter Object

export type TBaseQueryParameterObjectProps = {
	name: string;
	in: 'query';
	description: Option<string>;
	required: Option<boolean>;
};

const BaseQueryParameterObjectProps = {
	name: t.string,
	in: t.literal('query'),
	description: stringOption,
	required: booleanOption,
};

export type TStringQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'string';
};
const StringQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('string'),
	},
	'TStringQueryParameterObject',
);

export type TNumberQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'number';
};
const NumberQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('number'),
	},
	'TNumberQueryParameterObject',
);

export type TIntegerQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'integer';
};
const IntegerQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('integer'),
	},
	'TIntegerQueryParameterObject',
);

export type TBooleanQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'boolean';
};
const BooleanQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('boolean'),
	},
	'TBooleanQueryParameterObject',
);

export type TArrayQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'array';
	items: TNonArrayItemsObject;
};
const ArrayQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('array'),
		items: NonArrayItemsObject,
	},
	'TArrayQueryParameterObject',
);

export type TQueryParameterObject =
	| TStringQueryParameterObject
	| TNumberQueryParameterObject
	| TIntegerQueryParameterObject
	| TBooleanQueryParameterObject
	| TArrayQueryParameterObject;

export const QueryParameterObject = t.union(
	[
		StringQueryParameterObject,
		NumberQueryParameterObject,
		IntegerQueryParameterObject,
		BooleanQueryParameterObject,
		ArrayQueryParameterObject,
	],
	'TQueryParameterObject',
);

//#endregion

export type THeaderParameterObject = {
	name: string;
	in: 'header';
	description: Option<string>;
	required: Option<boolean>;
};
export const HeaderParameterObject = t.type(
	{
		name: t.string,
		in: t.literal('header'),
		description: stringOption,
		required: booleanOption,
	},
	'THeaderParameterObject',
);
export type TFormDataParameterObject = {
	name: string;
	in: 'formData';
	description: Option<string>;
	required: Option<boolean>;
};
export const FormDataParameterObject = t.type(
	{
		name: t.string,
		in: t.literal('formData'),
		description: stringOption,
		required: booleanOption,
	},
	'TFormDataParameterObject',
);

//#region Body Parameter Object

export type TBodyParameterObject = TBaseParameterObjectProps & {
	in: 'body';
	required: Option<boolean>;
	schema: TSchemaObject;
};

export const BodyParameterObject = t.type(
	{
		...BaseParameterObjectProps,
		in: t.literal('body'),
		required: booleanOption,
		schema: SchemaObject,
	},
	'TBodyParameterObject',
);

//#endregion

export type TParameterObject =
	| TPathParameterObject
	| TQueryParameterObject
	| THeaderParameterObject
	| TFormDataParameterObject
	| TBodyParameterObject;
export const ParameterObject = t.union(
	[PathParameterObject, QueryParameterObject, HeaderParameterObject, FormDataParameterObject, BodyParameterObject],
	'TParameterObject',
);

export type TExampleObject = TDictionary<string>;
export const ExampleObject = t.record(t.string, t.string, 'TExampleObject');

export type THeaderObject = TItemsObject & {
	description: Option<string>;
};
export const HeaderObject = t.intersection(
	[
		ItemsObject,
		t.type({
			description: stringOption,
		}),
	],
	'THeaderObject',
);

export type THeadersObject = TDictionary<THeaderObject>;
export const HeadersObject = t.record(t.string, HeaderObject, 'THeadersObject');

export type TResponseObject = {
	description: string;
	schema: Option<TSchemaObject>;
	headers: Option<THeadersObject>;
	examples: Option<TExampleObject>;
};
export const ResponseObject = t.type(
	{
		description: t.string,
		schema: optionFromNullable(SchemaObject),
		headers: optionFromNullable(HeadersObject),
		examples: optionFromNullable(ExampleObject),
	},
	'TResponseObject',
);

export type TResponsesObject = TDictionary<TResponseObject>;
export const ResponsesObject = t.record(t.string, ResponseObject, 'TResponsesObject');

export type TSecurityRequirementObject = TDictionary<string[]>;
export const SecurityRequirementObject = t.record(t.string, t.array(t.string), 'TSecurityRequirementObject');

export type TOperationObject = {
	tags: Option<string[]>;
	summary: Option<string>;
	description: Option<string>;
	externalDocs: Option<TExternalDocumentationObject>;
	operationId: Option<string>;
	consumes: Option<string[]>;
	produces: Option<string[]>;
	parameters: Option<Array<TParameterObject | TReferenceObject>>;
	responses: TResponsesObject;
	schemes: Option<string[]>;
	deprecated: Option<boolean>;
	security: Option<TSecurityRequirementObject[]>;
};
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
	'TOperationObject',
);

export type TPathItemObject = {
	$ref: Option<string>;
	get: Option<TOperationObject>;
	put: Option<TOperationObject>;
	post: Option<TOperationObject>;
	delete: Option<TOperationObject>;
	options: Option<TOperationObject>;
	head: Option<TOperationObject>;
	patch: Option<TOperationObject>;
	parameters: Option<Array<TParameterObject | TReferenceObject>>;
};
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
	'TPathItemObject',
);

export type TPathsObject = TDictionary<TPathItemObject>;
export const PathsObject = t.record(t.string, PathItemObject, 'TPathsObject');

export type TParametersDefinitionsObject = TDictionary<TParameterObject>;
export const ParametersDefinitionsObject = t.record(t.string, ParameterObject, 'TParametersDefinitionsObject');

export type TResponsesDefinitionsObject = TDictionary<TResponseObject>;
export const ResponsesDefinitionsObject = t.record(t.string, ResponseObject, 'TResponsesDefinitionsObject');

export type TScopesObject = TDictionary<string>;
export const ScopesObject = t.record(t.string, t.string, 'TScopesObject');

//#region SecuritySchemeObject

export type TBaseSecuritySchemeObjectProps = {
	description: Option<string>;
};
const BaseSecuritySchemeObjectProps = {
	description: stringOption,
};

export type TBasicSecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'basic';
};
const BasicSecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('basic'),
	},
	'TBasicSecuritySchemeObject',
);

export type TApiKeySecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'apiKey';
	in: 'query' | 'header';
	name: string;
};
const ApiKeySecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('apiKey'),
		in: t.union([t.literal('query'), t.literal('header')]),
		name: t.string,
	},
	'TApiKeySecuritySchemeObject',
);

export type TImplicitOAuth2SecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'oauth2';
	flow: 'implicit';
	authorizationUrl: string;
	scopes: TScopesObject;
};
const ImplicitOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('implicit'),
		authorizationUrl: t.string,
		scopes: ScopesObject,
	},
	'TImplicitOAuth2SecuritySchemeObject',
);
export type TPasswordOAuth2SecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'oauth2';
	flow: 'password';
	tokenUrl: string;
	scopes: TScopesObject;
};
const PasswordOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('password'),
		tokenUrl: t.string,
		scopes: ScopesObject,
	},
	'TPasswordOAuth2SecuritySchemeObject',
);
export type TApplicationOAuth2SecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'oauth2';
	flow: 'application';
	tokenUrl: string;
	scopes: TScopesObject;
};
const ApplicationOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('application'),
		tokenUrl: t.string,
		scopes: ScopesObject,
	},
	'TApplicationOAuth2SecuritySchemeObject',
);
export type TAccessCodeOAuth2SecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'oauth2';
	flow: 'accessCode';
	tokenUrl: string;
	scopes: TScopesObject;
};
const AccessCodeOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('accessCode'),
		tokenUrl: t.string,
		scopes: ScopesObject,
	},
	'TAccessCodeOAuth2SecuritySchemeObject',
);
export type TOAuth2SecuritySchemeObject =
	| TImplicitOAuth2SecuritySchemeObject
	| TPasswordOAuth2SecuritySchemeObject
	| TApplicationOAuth2SecuritySchemeObject
	| TAccessCodeOAuth2SecuritySchemeObject;
const OAuth2SecuritySchemeObject = t.union(
	[
		ImplicitOAuth2SecuritySchemeObject,
		PasswordOAuth2SecuritySchemeObject,
		ApplicationOAuth2SecuritySchemeObject,
		AccessCodeOAuth2SecuritySchemeObject,
	],
	'TOAuth2SecuritySchemeObject',
);

export type TSecuritySchemeObject =
	| TBasicSecuritySchemeObject
	| TApiKeySecuritySchemeObject
	| TOAuth2SecuritySchemeObject;
const SecuritySchemeObject = t.union(
	[BasicSecuritySchemeObject, ApiKeySecuritySchemeObject, OAuth2SecuritySchemeObject],
	'TSecuritySchemeObject',
);

//#endregion

export type TSecurityDefinitionsObject = TDictionary<TSecuritySchemeObject>;
export const SecurityDefinitionsObject = t.record(t.string, SecuritySchemeObject, 'TSecurityDefinitionsObject');

export type TTagObject = {
	name: string;
	description: Option<string>;
	externalDocs: Option<TExternalDocumentationObject>;
};
export const TagObject = t.type(
	{
		name: t.string,
		description: stringOption,
		externalDocs: optionFromNullable(ExternalDocumentationObject),
	},
	'TTagObject',
);

export type TSwaggerObject = {
	basePath: Option<string>;
	consumes: Option<string[]>;
	definitions: Option<TDefinitionsObject>;
	externalDocs: Option<TExternalDocumentationObject>;
	host: Option<string>;
	info: TInfoObject;
	parameters: Option<TParametersDefinitionsObject>;
	paths: TPathsObject;
	produces: Option<string[]>;
	responses: Option<TResponsesDefinitionsObject>;
	schemes: Option<string[]>;
	security: Option<TSecurityRequirementObject[]>;
	securityDefinitions: Option<TSecurityDefinitionsObject>;
	swagger: string;
	tags: Option<TTagObject[]>;
};
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
	'TSwaggerObject',
);
