/* eslint-disable @typescript-eslint/ban-types */
import { ajax } from 'rxjs/ajax';
import { useState, useMemo } from 'react';

export async function fetchJSON<T, B>(
  url: string,
  init: { method: string; headers: Record<string, string>; body?: B }
): Promise<T> {
  const { method, headers, body } = init;
  const result = await ajax({
    url,
    method,
    body,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  }).toPromise();

  return result.response as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;

type Fetcher<F extends Function, T> = (...args: ArgumentTypes<F>) => Promise<T>;

type UseApiResult<F extends Function, T> = {
  fetch: (...args: ArgumentTypes<F>) => void;
  data?: T;
  error?: Error;
  isLoading: boolean;
};

export function useApi<F extends Function, T>(
  fetcher: Fetcher<F, T>
): UseApiResult<F, T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  const result = useMemo(
    () => ({
      fetch(...args: ArgumentTypes<F>) {
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
