/* eslint-disable @typescript-eslint/ban-types */
import { ajax } from 'rxjs/ajax';
import { useState, useCallback } from 'react';

export async function fetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const { url, method, body, headers } =
    input instanceof Request ? input : new Request(input, init);
  const result = await ajax({
    url,
    method,
    body,
    headers,
  }).toPromise();

  if (result.responseType === 'json') {
    const blob = new Blob([JSON.stringify(result.response)], {
      type: 'application/json',
    });

    return new Response(blob, { status: result.status });
  }

  return new Response();
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

  const fetch = useCallback(
    (...args: ArgumentTypes<F>) => {
      setIsLoading(true);
      fetcher(...args)
        .then(setData)
        .catch(setError)
        .finally(() => setIsLoading(false));
    },
    [fetcher]
  );

  return { fetch, data, error, isLoading };
}
