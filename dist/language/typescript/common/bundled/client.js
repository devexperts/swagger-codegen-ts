"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = require("../../../../utils/ref");
const fs_1 = require("../../../../utils/fs");
const fp_ts_1 = require("fp-ts");
const pipeable_1 = require("fp-ts/lib/pipeable");
exports.clientRef = ref_1.fromString('#/client/client');
//TODO: make WebSocketChannelRequest.query a string after https://github.com/asyncapi/asyncapi/issues/294
exports.client = `
	import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/lib/HKT';
	import { MonadThrow, MonadThrow1, MonadThrow2 } from 'fp-ts/lib/MonadThrow';
	import { Errors } from 'io-ts';
	import { PathReporter } from 'io-ts/lib/PathReporter';
	import { left } from 'fp-ts/lib/Either';

	export interface Request {
		readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
		readonly url: string;
		readonly responseType: 'json' | 'blob' | 'text';
		readonly query?: string;
		readonly body?: unknown;
		readonly headers?: Record<string, unknown>;
	}

	export interface HTTPClient<F> extends MonadThrow<F> {
		readonly request: (request: Request) => HKT<F, unknown>;
	}
	export interface HTTPClient1<F extends URIS> extends MonadThrow1<F> {
		readonly request: (request: Request) => Kind<F, unknown>;
	}
	export interface HTTPClient2<F extends URIS2> extends MonadThrow2<F> {
		readonly request: (request: Request) => Kind2<F, unknown, unknown>;
	}

	export interface WebSocketChannelRequest {
		readonly method: 'GET' | 'POST';
		readonly channel: string;
		readonly query?: Record<string, unknown>;
		readonly headers?: Record<string, unknown>;
	}

	export interface WebSocketClient2<F extends URIS2> {
		readonly channel: (request: WebSocketChannelRequest) => WebSocketChannel2<F>;
	}
	export interface WebSocketClient1<F extends URIS> {
		readonly channel: (request: WebSocketChannelRequest) => WebSocketChannel1<F>;
	}
	export interface WebSocketClient<F> {
		readonly channel: (request: WebSocketChannelRequest) => WebSocketChannel<F>;
	}

	export interface WebSocketChannel<F> extends MonadThrow<F> {
		readonly send: (payload: unknown) => void;
		readonly message: HKT<F, unknown>
	}
	export interface WebSocketChannel1<F extends URIS> extends MonadThrow1<F> {
		readonly send: (payload: unknown) => void;
		readonly message: Kind<F, unknown>
	}
	export interface WebSocketChannel2<F extends URIS2> extends MonadThrow2<F> {
		readonly send: (payload: unknown) => void;
		readonly message: Kind2<F, unknown, unknown>
	}

	export class ResponseValidationError extends Error {
		static create(errors: Errors): ResponseValidationError {
			return new ResponseValidationError(errors);
		}

		constructor(readonly errors: Errors) {
			super(PathReporter.report(left(errors)).join('\\n\\n'));
			this.name = 'ResponseValidationError';
			Object.setPrototypeOf(this, ResponseValidationError.prototype);
		}
	}
`;
exports.clientFile = pipeable_1.pipe(exports.clientRef, fp_ts_1.either.map(ref => fs_1.fromRef(ref, '.ts', exports.client)));
