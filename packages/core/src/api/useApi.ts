import { useState, useMemo } from 'react';
import { ApiError } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyArray = any[];

type Fetcher<A extends AnyArray, T> = (...args: A) => Promise<T>;

type UseApiResult<A extends AnyArray, T> = {
  fetch: (...args: A) => void;
  data?: T;
  error?: ApiError;
  isLoading: boolean;
};

export function useApi<A extends AnyArray, T>(
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
