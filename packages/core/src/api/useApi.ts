import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, ApiState, CallApiOptions } from './types';

export type ApiCaller = (options: CallApiOptions) => Promise<unknown>;
export type Fetcher<FetchArgs extends unknown[], ResponseBody> = (
  callApi: ApiCaller,
  ...args: FetchArgs
) => Promise<ResponseBody>;

export type UseApiResult<FetchArgs extends unknown[], ResponseBody> = {
  fetch: (...args: FetchArgs) => void;
  data?: ResponseBody;
  error?: ApiError;
  isLoading: boolean;
  fetchArgs?: FetchArgs;
};

export function useApi<FetchArgs extends unknown[], ResponseBody>(
  callApi: ApiCaller,
  fetcher: Fetcher<FetchArgs, ResponseBody>
): UseApiResult<FetchArgs, ResponseBody> {
  const [apiState, setApiState] = useState({
    isLoading: false,
  } as ApiState<FetchArgs, ResponseBody>);
  const abortController = useMemo(() => new AbortController(), []);

  useEffect(() => {
    return () => abortController.abort();
  }, [abortController]);

  const fetchData = useCallback(
    async (...fetchArgs: FetchArgs) => {
      try {
        setApiState({
          isLoading: true,
        });
        const payload = await fetcher(
          (options: CallApiOptions) =>
            callApi({
              ...options,
              signal: abortController.signal,
            }),
          ...fetchArgs
        );
        setApiState({
          isLoading: false,
          data: payload,
          fetchArgs: fetchArgs,
        });
      } catch (err) {
        const error = err as ApiError & { name: string };

        if (error.name !== 'AbortError') {
          setApiState({
            isLoading: false,
            error: error,
            fetchArgs: fetchArgs,
          });
        }
      }
    },
    [fetcher, abortController, callApi]
  );

  const result = useMemo(() => ({}), []);

  return Object.assign(result, apiState, { fetch: fetchData });
}
