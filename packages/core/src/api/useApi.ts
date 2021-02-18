import { useCallback, useEffect, useMemo, useReducer } from 'react';
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
  fetchImpl: Fetch,
  fetcher: Fetcher<A, T>,
  { cache }: { cache?: RequestCache } = {}
): UseApiResult<A, T> {
  const [state, dispatch] = useReducer<
    (state: ApiState<A, T>, action: FetchApiAction<A, T>) => ApiState<A, T>
  >(apiReducer, {
    isLoading: false,
  });
  const abortController = useMemo(() => new AbortController(), []);

  useEffect(() => {
    return () => abortController.abort();
  }, [abortController]);

  const fetch = useCallback(
    (url: string, requestInit: RequestInit = {}) =>
      fetchImpl(url, {
        ...requestInit,
        cache,
        signal: abortController.signal,
      }),
    [fetchImpl, cache, abortController]
  );

  const fetchData = useCallback(
    async (...fetchArgs: A) => {
      try {
        dispatch({ type: 'FETCH_API_START' });
        const payload = await fetcher(fetch, ...fetchArgs);
        dispatch({ type: 'FETCH_API_SUCCEED', payload, fetchArgs });
      } catch (err) {
        const error = err as ApiError & { name: string };

        if (error.name !== 'AbortError') {
          dispatch({ type: 'FETCH_API_FAILED', error, fetchArgs });
        }
      }
    },
    [fetcher, fetch]
  );

  const result = useMemo(() => ({}), []);

  return Object.assign(result, state, { fetch: fetchData });
}
