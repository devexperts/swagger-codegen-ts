import { HTTPClient2 } from '../out/petstore.yaml/client/client';
import { Monad } from 'fp-ts-rxjs/Observable';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, startWith, switchMap, take } from 'rxjs/operators';
import { failure, pending, RemoteData, success } from '@devexperts/remote-data-ts';
import { getRemoteDataM } from '@devexperts/remote-data-ts/dist/remote-data-t';
import { MonadThrow2 } from 'fp-ts/MonadThrow';

export const URI = 'LiveData' as const;
export type URI = typeof URI;
export type LiveData<E, A> = Observable<RemoteData<E, A>>;

declare module 'fp-ts/HKT' {
	interface URItoKind2<E, A> {
		readonly [URI]: LiveData<E, A>;
	}
}

const remoteDataMonad: MonadThrow2<URI> = {
	...getRemoteDataM(Monad),
	URI,
	throwError: e => of(failure(e)),
};

export const liveDataClient: HTTPClient2<URI> = {
	...remoteDataMonad,
	request: ({ body, headers, method, query, url }) =>
		ajax({
			body: body && JSON.stringify(body),
			url: query ? `${url}?${query}` : url,
			headers,
			method,
		}).pipe(
			map(response => success(response.response)),
			catchError(remoteDataMonad.throwError),
			startWith(pending),
		),
};

export const liveDataClientWithAuth = (token$: Observable<string>): HTTPClient2<URI> => ({
	...liveDataClient,
	request: req =>
		token$.pipe(
			take(1),
			switchMap(token =>
				liveDataClient.request({
					...req,
					headers: {
						...req.headers,
						Authorization: `Bearer ${token}`,
					},
				}),
			),
		),
});
