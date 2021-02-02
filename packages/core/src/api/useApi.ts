import { useState, useMemo } from 'react';
import { ApiError } from './types';

export type Fetcher<A extends unknown[], T> = (...args: A) => Promise<T>;

export type UseApiResult<A extends unknown[], T> = {
  fetch: (...args: A) => void;
  data?: T;
  error?: ApiError;
  isLoading: boolean;
};

export function useApi<A extends unknown[], T>(
  fetcher: Fetcher<A, T>
): UseApiResult<A, T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(false);

  const result = useMemo(
    () => ({
      fetch(...args: A) {
        setIsLoading(true);
        fetcher(...args)
          .then(setData)
          .catch(setError)
          .finally(() => setIsLoading(false));
      },
    }),
    [fetcher]
  );

  return Object.assign(result, { data, error, isLoading });
}
