import { literal, union } from 'io-ts';

export type ParameterInPath = 'path';
export const parameterInPathIO = literal('path');

export type ParameterInQuery = 'query';
export const parameterInQueryIO = literal('query');

export type ParameterInHeader = 'header';
export const parameterInHeaderIO = literal('header');

export type ParameterInCookie = 'cookie';
export const parameterInCookieIO = literal('cookie');

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameterIn
export type ParameterIn = ParameterInPath | ParameterInQuery | ParameterInHeader | ParameterInCookie;
export const parameterInIO = union(
	[parameterInCookieIO, parameterInHeaderIO, parameterInPathIO, parameterInQueryIO],
	'ParameterIn',
);
