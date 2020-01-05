import { fromString } from '../../../../utils/ref';
import { fromRef } from '../../../../utils/fs';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';

export const clientRef = fromString('#/client/client');

//TODO: make WebSocketChannelRequest.query a string after https://github.com/asyncapi/asyncapi/issues/294
export const client = `
	import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/lib/HKT';
	import { MonadThrow, MonadThrow1, MonadThrow2 } from 'fp-ts/lib/MonadThrow';
	import { Errors, UnknownRecord } from 'io-ts';
	import { PathReporter } from 'io-ts/lib/PathReporter';
	import { left } from 'fp-ts/lib/Either';

	const ResponseValidationErrorSymbol = Symbol('ResponseValidationError');

	export interface Request {
		readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
		readonly url: string;
		readonly query?: string;
		readonly body?: unknown;
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

		static [Symbol.hasInstance](target: unknown) {
			return UnknownRecord.is(target) && target.symbol === ResponseValidationErrorSymbol;
		}

		symbol = ResponseValidationErrorSymbol;

		constructor(readonly errors: Errors) {
			super(PathReporter.report(left(errors)).join('\\n\\n'));
			this.name = ResponseValidationErrorSymbol.toString();
			this.toString = () => PathReporter.report(left(errors)).join('\\n\\n');
			Object.setPrototypeOf(this, ResponseValidationError);
		}
	}
`;

export const clientFile = pipe(
	clientRef,
	either.map(ref => fromRef(ref, '.ts', client)),
);
