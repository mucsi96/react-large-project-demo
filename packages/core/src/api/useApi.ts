import { useMemo, useReducer } from 'react';
import { apiReducer } from './apiReducer';
import { ApiError, ApiState, FetchApiAction } from './types';

export type Fetch = (url: string, options?: RequestInit) => Promise<Response>;
export type Fetcher<A extends unknown[], T> = (
  fetch: Fetch,
  ...args: A
) => Promise<T>;

export type UseApiResult<A extends unknown[], T> = {
  fetch: (...args: A) => void;
  data?: T;
  error?: ApiError;
  isLoading: boolean;
  fetchArgs?: A;
};

export function useApi<A extends unknown[], T>(
  fetch: Fetch,
  fetcher: Fetcher<A, T>
): UseApiResult<A, T> {
  const [state, dispatch] = useReducer<
    (state: ApiState<A, T>, action: FetchApiAction<A, T>) => ApiState<A, T>
  >(apiReducer, {
    isLoading: false,
  });

  const result = useMemo(
    () => ({
      fetch(...fetchArgs: A) {
        dispatch({ type: 'FETCH_API_START' });
        fetcher(fetch, ...fetchArgs)
          .then((payload) =>
            dispatch({ type: 'FETCH_API_SUCCEED', payload, fetchArgs })
          )
          .catch((error: ApiError) =>
            dispatch({ type: 'FETCH_API_FAILED', error, fetchArgs })
          );
      },
    }),
    [fetcher, fetch]
  );

  return Object.assign(result, state);
}
