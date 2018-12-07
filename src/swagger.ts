import * as t from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';
import { Option } from 'fp-ts/lib/Option';
import { mixed } from 'io-ts';
import { TPathParameterObject } from './swagger';

export const stringOption = createOptionFromNullable(t.string);
export const booleanOption = createOptionFromNullable(t.boolean);
export const numberOption = createOptionFromNullable(t.number);
export const stringArrayOption = createOptionFromNullable(t.array(t.string));
export const primitiveArrayOption = createOptionFromNullable(t.array(t.union([t.string, t.boolean, t.number])));

export type TDictionary<A> = {
	[key: string]: A;
};

export type TContactObject = {
	name: Option<string>;
	url: Option<string>;
	email: Option<string>;
};
export const ContactObject: t.Type<TContactObject, mixed> = t.type({
	name: stringOption,
	url: stringOption,
	email: stringOption,
});

export type TLicenseObject = {
	name: string;
	url: Option<string>;
};
export const LicenseObject: t.Type<TLicenseObject, mixed> = t.type({
	name: t.string,
	url: stringOption,
});

export type TInfoObject = {
	title: string;
	description: Option<string>;
	termsOfService: Option<string>;
	contact: Option<TContactObject>;
	license: Option<TLicenseObject>;
	version: string;
};
export const InfoObject: t.Type<TInfoObject, mixed> = t.type({
	title: t.string,
	description: stringOption,
	termsOfService: stringOption,
	contact: createOptionFromNullable(ContactObject),
	license: createOptionFromNullable(LicenseObject),
	version: t.string,
});

export type TExternalDocumentationObject = {
	description: Option<string>;
	url: string;
};
export const ExternalDocumentationObject: t.Type<TExternalDocumentationObject, mixed> = t.type({
	description: stringOption,
	url: t.string,
});

export type TReferenceObject = {
	$ref: string;
};
export const ReferenceObject: t.Type<TReferenceObject, mixed> = t.type({
	$ref: t.string,
});

//#region Schema Object

export type TBaseSchemaObjectProps = {};
const BaseSchemaObjectProps = {};
(): t.Type<TBaseSchemaObjectProps, mixed> => t.type(BaseSchemaObjectProps); //tslint:disable-line no-unused-expression (integrity check)

export type TObjectSchemaObject = TBaseSchemaObjectProps & {
	type: 'object';
	properties: Option<TDictionary<TSchemaObject>>;
	required: Option<string[]>;
	additionalProperties: Option<TSchemaObject>;
};

export type TStringPropertySchemaObject = TBaseSchemaObjectProps & {
	type: 'string';
	format: Option<string>;
	enum: Option<Array<string | number | boolean>>;
};
export const StringPropertySchemaObject: t.Tagged<'type', TStringPropertySchemaObject, mixed> = t.type({
	...BaseSchemaObjectProps,
	type: t.literal('string'),
	format: stringOption,
	enum: primitiveArrayOption,
});

export type TNumberPropertySchemaObject = TBaseSchemaObjectProps & {
	type: 'number';
	format: Option<string>;
};
export const NumberPropertySchemaObject: t.Tagged<'type', TNumberPropertySchemaObject, mixed> = t.type({
	...BaseSchemaObjectProps,
	type: t.literal('number'),
	format: stringOption,
});

export type TIntegerPropertySchemaObject = TBaseSchemaObjectProps & {
	type: 'integer';
	format: Option<string>;
};
export const IntegerPropertySchemaObject: t.Tagged<'type', TIntegerPropertySchemaObject, mixed> = t.type({
	...BaseSchemaObjectProps,
	type: t.literal('integer'),
	format: stringOption,
});

export type TBooleanPropertySchemaObject = TBaseSchemaObjectProps & {
	type: 'boolean';
};
export const BooleanPropertySchemaObject: t.Tagged<'type', TBooleanPropertySchemaObject, mixed> = t.type({
	...BaseSchemaObjectProps,
	type: t.literal('boolean'),
});

export type TReferenceSchemaObject = TReferenceObject &
	TBaseSchemaObjectProps & {
		type: undefined;
	};
export const ReferenceSchemaObject = t.intersection([
	ReferenceObject,
	t.type({
		...BaseSchemaObjectProps,
		type: t.literal(undefined as any),
	}),
]);

export type TArraySchemaObject = TBaseSchemaObjectProps & {
	type: 'array';
	items: TSchemaObject;
};

export type TSchemaObject =
	| TReferenceSchemaObject
	| TObjectSchemaObject
	| TStringPropertySchemaObject
	| TNumberPropertySchemaObject
	| TIntegerPropertySchemaObject
	| TBooleanPropertySchemaObject
	| TArraySchemaObject;
export const SchemaObject: t.Type<TSchemaObject, mixed> = t.recursion<TSchemaObject, mixed>(
	'SchemaObject',
	SchemaObject => {
		const ArraySchemaObject: t.Tagged<'type', TArraySchemaObject, mixed> = t.type({
			...BaseSchemaObjectProps,
			type: t.literal('array'),
			items: SchemaObject,
		});
		const ObjectSchemaObject: t.Tagged<'type', TObjectSchemaObject, mixed> = t.type({
			...BaseSchemaObjectProps,
			required: stringArrayOption,
			type: t.literal('object'),
			properties: createOptionFromNullable(t.dictionary(t.string, SchemaObject)),
			additionalProperties: createOptionFromNullable(SchemaObject),
		});

		return t.taggedUnion('type', [
			ReferenceSchemaObject,
			ArraySchemaObject,
			ObjectSchemaObject,
			StringPropertySchemaObject,
			NumberPropertySchemaObject,
			IntegerPropertySchemaObject,
			BooleanPropertySchemaObject,
		]);
	},
);

//#endregion

export type TDefinitionsObject = TDictionary<TSchemaObject>;
export const DefinitionsObject: t.Type<TDefinitionsObject, mixed> = t.dictionary(t.string, SchemaObject);

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
	collectionFormat: createOptionFromNullable(
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
((): t.Type<TBaseItemsObject, mixed> => t.type(BaseItemsObjectProps))(); //tslint:disable-line no-unused-expression (integrity check) check

export type TStringItemsObject = TBaseItemsObject & {
	type: 'string';
};
export const StringItemsObject: t.Tagged<'type', TStringItemsObject, mixed> = t.type({
	...BaseItemsObjectProps,
	type: t.literal('string'),
});

export type TNumberItemsObject = TBaseItemsObject & {
	type: 'number';
};
export const NumberItemsObject: t.Tagged<'type', TNumberItemsObject, mixed> = t.type({
	...BaseItemsObjectProps,
	type: t.literal('number'),
});

export type TIntegerItemsObject = TBaseItemsObject & {
	type: 'integer';
};
export const IntegerItemsObject: t.Tagged<'type', TIntegerItemsObject, mixed> = t.type({
	...BaseItemsObjectProps,
	type: t.literal('integer'),
});

export type TBooleanItemsObject = TBaseItemsObject & {
	type: 'boolean';
};
export const BooleanItemsObject: t.Tagged<'type', TBooleanItemsObject, mixed> = t.type({
	...BaseItemsObjectProps,
	type: t.literal('boolean'),
});

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
export const ItemsObject: t.Type<TItemsObject, mixed> = t.recursion<TItemsObject>('ItemsObject', ItemsObject => {
	const ArrayItemsObject = t.type({
		...BaseItemsObjectProps,
		type: t.literal('array'),
		items: createOptionFromNullable(t.array(ItemsObject)),
	});
	return t.taggedUnion('type', [
		ArrayItemsObject,
		StringItemsObject,
		NumberItemsObject,
		IntegerItemsObject,
		BooleanItemsObject,
	]) as any;
});

export type TNonArrayItemsObject = TStringItemsObject | TNumberItemsObject | TIntegerItemsObject | TBooleanItemsObject;
export const NonArrayItemsObject: t.Type<TNonArrayItemsObject, mixed> = t.taggedUnion('type', [
	StringItemsObject,
	NumberItemsObject,
	IntegerItemsObject,
	BooleanItemsObject,
]);

//#endregion

export type TBaseParameterObjectProps = {
	name: string;
	description: Option<string>;
};
const BaseParameterObjectProps = {
	name: t.string,
	description: stringOption,
};
(): t.Type<TBaseParameterObjectProps, mixed> => t.type(BaseParameterObjectProps); //tslint:disable-line no-unused-expression (integrity check)

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
(): t.Type<TBasePathParameterObjectProps, mixed> => t.type(BasePathParameterObjectProps); //tslint:disable-line no-unused-expression (integrity check)

export type TStringPathParameterObject = TBasePathParameterObjectProps & {
	type: 'string';
};
const StringPathParameterObject: t.Tagged<'type', TStringPathParameterObject, mixed> = t.type({
	...BasePathParameterObjectProps,
	type: t.literal('string'),
});

export type TNumberPathParameterObject = TBasePathParameterObjectProps & {
	type: 'number';
};
const NumberPathParameterObject: t.Tagged<'type', TNumberPathParameterObject, mixed> = t.type({
	...BasePathParameterObjectProps,
	type: t.literal('number'),
});

export type TIntegerPathParameterObject = TBasePathParameterObjectProps & {
	type: 'integer';
};
const IntegerPathParameterObject: t.Tagged<'type', TIntegerPathParameterObject, mixed> = t.type({
	...BasePathParameterObjectProps,
	type: t.literal('integer'),
});

export type TBooleanPathParameterObject = TBasePathParameterObjectProps & {
	type: 'boolean';
};
const BooleanPathParameterObject: t.Tagged<'type', TBooleanPathParameterObject, mixed> = t.type({
	...BasePathParameterObjectProps,
	type: t.literal('boolean'),
});

export type TArrayPathParameterObject = TBasePathParameterObjectProps & {
	type: 'array';
	items: TNonArrayItemsObject;
};
const ArrayPathParameterObject: t.Tagged<'type', TArrayPathParameterObject, mixed> = t.type({
	...BasePathParameterObjectProps,
	type: t.literal('array'),
	items: NonArrayItemsObject,
});

export type TPathParameterObject =
	| TStringPathParameterObject
	| TNumberPathParameterObject
	| TIntegerPathParameterObject
	| TBooleanPathParameterObject
	| TArrayPathParameterObject;

export const PathParameterObject: t.Tagged<'in', TPathParameterObject, mixed> = t.taggedUnion('type', [
	StringPathParameterObject,
	NumberPathParameterObject,
	IntegerPathParameterObject,
	BooleanPathParameterObject,
	ArrayPathParameterObject,
]) as any;

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

(): t.Type<TBaseQueryParameterObjectProps, mixed> => t.type(BaseQueryParameterObjectProps); //tslint:disable-line no-unused-expression (integrity check)

export type TStringQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'string';
};
const StringQueryParameterObject: t.Tagged<'type', TStringQueryParameterObject, mixed> = t.type({
	...BaseQueryParameterObjectProps,
	type: t.literal('string'),
});

export type TNumberQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'number';
};
const NumberQueryParameterObject: t.Tagged<'type', TNumberQueryParameterObject, mixed> = t.type({
	...BaseQueryParameterObjectProps,
	type: t.literal('number'),
});

export type TIntegerQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'integer';
};
const IntegerQueryParameterObject: t.Tagged<'type', TIntegerQueryParameterObject, mixed> = t.type({
	...BaseQueryParameterObjectProps,
	type: t.literal('integer'),
});

export type TBooleanQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'boolean';
};
const BooleanQueryParameterObject: t.Tagged<'type', TBooleanQueryParameterObject, mixed> = t.type({
	...BaseQueryParameterObjectProps,
	type: t.literal('boolean'),
});

export type TArrayQueryParameterObject = TBaseQueryParameterObjectProps & {
	type: 'array';
	items: TNonArrayItemsObject;
};
const ArrayQueryParameterObject: t.Tagged<'type', TArrayQueryParameterObject, mixed> = t.type({
	...BaseQueryParameterObjectProps,
	type: t.literal('array'),
	items: NonArrayItemsObject,
});

export type TQueryParameterObject =
	| TStringQueryParameterObject
	| TNumberQueryParameterObject
	| TIntegerQueryParameterObject
	| TBooleanQueryParameterObject
	| TArrayQueryParameterObject;

export const QueryParameterObject: t.Tagged<'in', TQueryParameterObject, mixed> = t.taggedUnion('type', [
	StringQueryParameterObject,
	NumberQueryParameterObject,
	IntegerQueryParameterObject,
	BooleanQueryParameterObject,
	ArrayQueryParameterObject,
]) as any;

//#endregion

export type THeaderParameterObject = {
	name: string;
	in: 'header';
	description: Option<string>;
	required: Option<boolean>;
};
export const HeaderParameterObject: t.Tagged<'in', THeaderParameterObject, mixed> = t.type({
	name: t.string,
	in: t.literal('header'),
	description: stringOption,
	required: booleanOption,
});
export type TFormDataParameterObject = {
	name: string;
	in: 'formData';
	description: Option<string>;
	required: Option<boolean>;
};
export const FormDataParameterObject: t.Tagged<'in', TFormDataParameterObject, mixed> = t.type({
	name: t.string,
	in: t.literal('formData'),
	description: stringOption,
	required: booleanOption,
});

//#region Body Parameter Object

export type TBodyParameterObject = TBaseParameterObjectProps & {
	in: 'body';
	required: Option<boolean>;
	schema: TSchemaObject;
};

export const BodyParameterObject: t.Tagged<'in', TBodyParameterObject, mixed> = t.type({
	...BaseParameterObjectProps,
	in: t.literal('body'),
	required: booleanOption,
	schema: SchemaObject,
});

//#endregion

export type TParameterObject =
	| TPathParameterObject
	| TQueryParameterObject
	| THeaderParameterObject
	| TFormDataParameterObject
	| TBodyParameterObject;
export const ParameterObject: t.Type<TParameterObject, mixed> = t.taggedUnion('in', [
	PathParameterObject,
	QueryParameterObject,
	HeaderParameterObject,
	FormDataParameterObject,
	BodyParameterObject,
]);

export type TExampleObject = TDictionary<string>;
export const ExampleObject = t.dictionary(t.string, t.any);

export type THeaderObject = TItemsObject & {
	description: Option<string>;
};
export const HeaderObject: t.Type<THeaderObject, mixed> = t.intersection([
	ItemsObject,
	t.type({
		description: stringOption,
	}),
]);

export type THeadersObject = TDictionary<THeaderObject>;
export const HeadersObject = t.dictionary(t.string, HeaderObject);

export type TResponseObject = {
	description: string;
	schema: Option<TSchemaObject>;
	headers: Option<THeadersObject>;
	examples: Option<TExampleObject>;
};
export const ResponseObject: t.Type<TResponseObject, mixed> = t.type({
	description: t.string,
	schema: createOptionFromNullable(SchemaObject),
	headers: createOptionFromNullable(HeadersObject),
	examples: createOptionFromNullable(ExampleObject),
});

export type TResponsesObject = TDictionary<TResponseObject>;
export const ResponsesObject: t.Type<TResponsesObject, mixed> = t.dictionary(t.string, ResponseObject);

export type TSecurityRequirementObject = TDictionary<string[]>;
export const SecurityRequirementObject: t.Type<TSecurityRequirementObject, mixed> = t.dictionary(
	t.string,
	t.array(t.string),
);

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
export const OperationObject: t.Type<TOperationObject, mixed> = t.type({
	tags: stringArrayOption,
	summary: stringOption,
	description: stringOption,
	externalDocs: createOptionFromNullable(ExternalDocumentationObject),
	operationId: stringOption,
	consumes: stringArrayOption,
	produces: stringArrayOption,
	parameters: createOptionFromNullable(t.array(t.union([ParameterObject, ReferenceObject]))),
	responses: ResponsesObject,
	schemes: stringArrayOption,
	deprecated: booleanOption,
	security: createOptionFromNullable(t.array(SecurityRequirementObject)),
});

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
export const PathItemObject: t.Type<TPathItemObject, mixed> = t.type({
	$ref: stringOption,
	get: createOptionFromNullable(OperationObject),
	put: createOptionFromNullable(OperationObject),
	post: createOptionFromNullable(OperationObject),
	delete: createOptionFromNullable(OperationObject),
	options: createOptionFromNullable(OperationObject),
	head: createOptionFromNullable(OperationObject),
	patch: createOptionFromNullable(OperationObject),
	parameters: createOptionFromNullable(t.array(t.union([ParameterObject, ReferenceObject]))),
});

export type TPathsObject = TDictionary<TPathItemObject>;
export const PathsObject: t.Type<TPathsObject, mixed> = t.dictionary(t.string, PathItemObject);

export type TParametersDefinitionsObject = TDictionary<TParameterObject>;
export const ParametersDefinitionsObject: t.Type<TParametersDefinitionsObject, mixed> = t.dictionary(
	t.string,
	ParameterObject,
);

export type TResponsesDefinitionsObject = TDictionary<TResponseObject>;
export const ResponsesDefinitionsObject: t.Type<TResponsesDefinitionsObject, mixed> = t.dictionary(
	t.string,
	ResponseObject,
);

export type TScopesObject = TDictionary<string>;
export const ScopesObject: t.Type<TScopesObject, mixed> = t.dictionary(t.string, t.string);

//#region SecuritySchemeObject

export type TBaseSecuritySchemeObjectProps = {
	description: Option<string>;
};
const BaseSecuritySchemeObjectProps = {
	description: stringOption,
};
(): t.Type<TBaseSecuritySchemeObjectProps, mixed> => t.type(BaseSecuritySchemeObjectProps); //tslint:disable-line no-unused-expression (integrity check)

export type TBasicSecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'basic';
};
const BasicSecuritySchemeObject: t.Tagged<'type', TBasicSecuritySchemeObject, mixed> = t.type({
	...BaseSecuritySchemeObjectProps,
	type: t.literal('basic'),
});

export type TApiKeySecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'apiKey';
	in: 'query' | 'header';
	name: string;
};
const ApiKeySecuritySchemeObject: t.Tagged<'type', TApiKeySecuritySchemeObject, mixed> = t.type({
	...BaseSecuritySchemeObjectProps,
	type: t.literal('apiKey'),
	in: t.union([t.literal('query'), t.literal('header')]),
	name: t.string,
});

export type TImplicitOAuth2SecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'oauth2';
	flow: 'implicit';
	authorizationUrl: string;
	scopes: TScopesObject;
};
const ImplicitOAuth2SecuritySchemeObject: t.Tagged<'flow', TImplicitOAuth2SecuritySchemeObject, mixed> = t.type({
	...BaseSecuritySchemeObjectProps,
	type: t.literal('oauth2'),
	flow: t.literal('implicit'),
	authorizationUrl: t.string,
	scopes: ScopesObject,
});
export type TPasswordOAuth2SecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'oauth2';
	flow: 'password';
	tokenUrl: string;
	scopes: TScopesObject;
};
const PasswordOAuth2SecuritySchemeObject: t.Tagged<'flow', TPasswordOAuth2SecuritySchemeObject, mixed> = t.type({
	...BaseSecuritySchemeObjectProps,
	type: t.literal('oauth2'),
	flow: t.literal('password'),
	tokenUrl: t.string,
	scopes: ScopesObject,
});
export type TApplicationOAuth2SecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'oauth2';
	flow: 'application';
	tokenUrl: string;
	scopes: TScopesObject;
};
const ApplicationOAuth2SecuritySchemeObject: t.Tagged<'flow', TApplicationOAuth2SecuritySchemeObject, mixed> = t.type({
	...BaseSecuritySchemeObjectProps,
	type: t.literal('oauth2'),
	flow: t.literal('application'),
	tokenUrl: t.string,
	scopes: ScopesObject,
});
export type TAccessCodeOAuth2SecuritySchemeObject = TBaseSecuritySchemeObjectProps & {
	type: 'oauth2';
	flow: 'accessCode';
	tokenUrl: string;
	scopes: TScopesObject;
};
const AccessCodeOAuth2SecuritySchemeObject: t.Tagged<'flow', TAccessCodeOAuth2SecuritySchemeObject, mixed> = t.type({
	...BaseSecuritySchemeObjectProps,
	type: t.literal('oauth2'),
	flow: t.literal('accessCode'),
	tokenUrl: t.string,
	scopes: ScopesObject,
});
export type TOAuth2SecuritySchemeObject =
	| TImplicitOAuth2SecuritySchemeObject
	| TPasswordOAuth2SecuritySchemeObject
	| TApplicationOAuth2SecuritySchemeObject
	| TAccessCodeOAuth2SecuritySchemeObject;
const OAuth2SecuritySchemeObject: t.Tagged<'type', TOAuth2SecuritySchemeObject, mixed> = t.taggedUnion('flow', [
	ImplicitOAuth2SecuritySchemeObject,
	PasswordOAuth2SecuritySchemeObject,
	ApplicationOAuth2SecuritySchemeObject,
	AccessCodeOAuth2SecuritySchemeObject,
]) as any;

export type TSecuritySchemeObject =
	| TBasicSecuritySchemeObject
	| TApiKeySecuritySchemeObject
	| TOAuth2SecuritySchemeObject;
const SecuritySchemeObject: t.Type<TSecuritySchemeObject, mixed> = t.taggedUnion('type', [
	BasicSecuritySchemeObject,
	ApiKeySecuritySchemeObject,
	OAuth2SecuritySchemeObject,
]);

//#endregion

export type TSecurityDefinitionsObject = TDictionary<TSecuritySchemeObject>;
export const SecurityDefinitionsObject: t.Type<TSecurityDefinitionsObject, mixed> = t.dictionary(
	t.string,
	SecuritySchemeObject,
);

export type TTagObject = {
	name: string;
	description: Option<string>;
	externalDocs: Option<TExternalDocumentationObject>;
};
export const TagObject: t.Type<TTagObject, mixed> = t.type({
	name: t.string,
	description: stringOption,
	externalDocs: createOptionFromNullable(ExternalDocumentationObject),
});

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
export const SwaggerObject: t.Type<TSwaggerObject, mixed> = t.type({
	basePath: stringOption,
	consumes: stringArrayOption,
	definitions: createOptionFromNullable(DefinitionsObject),
	externalDocs: createOptionFromNullable(ExternalDocumentationObject),
	host: stringOption,
	info: InfoObject,
	parameters: createOptionFromNullable(ParametersDefinitionsObject),
	paths: PathsObject,
	produces: stringArrayOption,
	responses: createOptionFromNullable(ResponsesDefinitionsObject),
	schemes: stringArrayOption,
	security: createOptionFromNullable(t.array(SecurityRequirementObject)),
	securityDefinitions: createOptionFromNullable(SecurityDefinitionsObject),
	swagger: t.string,
	tags: createOptionFromNullable(t.array(TagObject)),
});
