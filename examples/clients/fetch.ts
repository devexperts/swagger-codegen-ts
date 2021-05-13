import { HTTPClient1 } from '../out/petstore.yaml/client/client';
import { MonadThrow1 } from 'fp-ts/MonadThrow';
import { pipe } from 'fp-ts/function';
import { record } from 'fp-ts';

export const URI = 'Promise' as const;
export type URI = typeof URI;

declare module 'fp-ts/HKT' {
	interface URItoKind<A> {
		readonly [URI]: Promise<A>;
	}
}

export const monadPromise: MonadThrow1<URI> = {
	URI,
	of: Promise.resolve,
	throwError: Promise.reject,
	map: (fa, f) => fa.then(a => Promise.resolve(f(a))),
	ap: (fab, fa) => fab.then(fn => fa.then(a => fn(a))),
	chain: (fa, f) => fa.then(f),
};

export const fetchClient: HTTPClient1<URI> = {
	...monadPromise,
	request: ({ body, headers, method, query, url }) =>
		fetch(query ? `${url}?${query}` : url, {
			body: body && JSON.stringify(body),
			headers:
				headers &&
				pipe(
					headers,
					record.map(val => {
						if (Array.isArray(val)) {
							return val.join(',');
						} else {
							return String(val);
						}
					}),
				),
			method,
		}),
};
