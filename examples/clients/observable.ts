import { HTTPClient1 } from '../out/petstore.yaml/client/client';
import { URI, Monad } from 'fp-ts-rxjs/Observable';
import { throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

export const rxjsClient: HTTPClient1<URI> = {
	...Monad,
	throwError,
	request: ({ body, headers, method, query, url }) =>
		ajax({
			body: body && JSON.stringify(body),
			url: query ? `${url}?${query}` : url,
			headers,
			method,
		}).pipe(map(response => response.response)),
};
