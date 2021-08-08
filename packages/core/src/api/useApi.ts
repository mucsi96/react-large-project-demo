import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiCaller, ApiError, ApiState, CallApiOptions } from './types';

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

export type UseApiOptions = {
  cache?: boolean;
  noAbortOnSubsequentCall?: boolean;
};

export function useApi<FetchArgs extends unknown[], ResponseBody>(
  callApi: ApiCaller,
  fetcher: Fetcher<FetchArgs, ResponseBody>,
  { cache, noAbortOnSubsequentCall }: UseApiOptions = {}
): UseApiResult<FetchArgs, ResponseBody> {
  const [apiState, setApiState] = useState({
    isLoading: false,
  } as ApiState<FetchArgs, ResponseBody>);
  const abortController = useRef<AbortController>();

  useEffect(() => {
    return () => abortController.current?.abort();
  }, []);

  const fetchData = useCallback(
    async (...fetchArgs: FetchArgs) => {
      if (!noAbortOnSubsequentCall) {
        abortController.current?.abort();
      }

      try {
        abortController.current = new AbortController();
        setApiState({
          isLoading: true,
        });
        const payload = await fetcher(
          (options: CallApiOptions) =>
            callApi({
              ...options,
              cache,
              signal: abortController.current?.signal,
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
        } else {
          setApiState({
            isLoading: false,
            fetchArgs: fetchArgs,
          });
        }
      }
    },
    [fetcher, abortController, callApi, cache, noAbortOnSubsequentCall]
  );

  const result = useMemo(() => ({}), []);

  return Object.assign(result, apiState, { fetch: fetchData });
}
