import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ApiCaller,
  ApiError,
  ApiResponse,
  CallApiOptions,
  Fetcher,
  FetchState,
} from './types';

export type UseApiResult<FetchArgs extends unknown[], ResponseBody> = [
  (...args: FetchArgs) => void,
  ApiResponse<FetchArgs, ResponseBody>
];

export type UseApiOptions = {
  cache?: boolean;
  noAbortOnSubsequentCall?: boolean;
};

export function useApi<FetchArgs extends unknown[], ResponseBody>(
  callApi: ApiCaller,
  fetcher: Fetcher<FetchArgs, ResponseBody>,
  { cache, noAbortOnSubsequentCall }: UseApiOptions = {}
): UseApiResult<FetchArgs, ResponseBody> {
  const [apiState, setApiState] = useState({ response: {} } as ApiResponse<
    FetchArgs,
    ResponseBody
  >);
  const mounted = useRef(true);
  const abortController = useRef<AbortController>();

  useEffect(() => {
    return () => {
      mounted.current = false;
      abortController.current?.abort();
    };
  }, []);

  const fetchData = useCallback(
    async (...fetchArgs: FetchArgs) => {
      if (!noAbortOnSubsequentCall) {
        abortController.current?.abort();
      }

      try {
        abortController.current = new AbortController();
        setApiState({ fetchState: FetchState.LOADING });
        const payload = await fetcher(
          (options: CallApiOptions) =>
            callApi({
              ...options,
              cache,
              signal: abortController.current?.signal,
            }),
          ...fetchArgs
        );
        setApiState({ fetchState: FetchState.READY, data: payload, fetchArgs });
      } catch (err) {
        const error = err as ApiError & { name: string };

        if (error.name !== 'AbortError') {
          setApiState({ fetchState: FetchState.FAILED, error, fetchArgs });
        } else if (mounted.current) {
          setApiState({
            fetchArgs,
          });
        }
      }
    },
    [fetcher, abortController, callApi, cache, noAbortOnSubsequentCall]
  );

  return [fetchData, apiState];
}
