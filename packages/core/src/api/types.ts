export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type CallApiOptions = {
  href: string;
  queryParams?: Record<string, string>;
  method?: ApiMethod;
  headers?: HeadersInit;
  signal?: AbortSignal | null;
  body?: unknown;
  cache?: boolean;
};

export type ApiCaller<ResponseBody = unknown> = (
  options: CallApiOptions
) => Promise<ResponseBody>;

export type ApiErrorResponse = {
  error?: {
    message?: string;
  };
};

export type ApiError = {
  message: string;
  response?: ApiErrorResponse;
  status?: number;
};

export type Fetcher<FetchArgs extends unknown[], ResponseBody> = (
  callApi: ApiCaller,
  ...args: FetchArgs
) => Promise<ResponseBody>;

export enum FetchState {
  LOADING = 'LOADING',
  READY = 'READY',
  FAILED = 'FAILED',
}

export type ApiResponse<FetchArgs extends unknown[], ResponseBody> = {
  data?: ResponseBody;
  fetchState?: FetchState;
  error?: ApiError;
  fetchArgs?: FetchArgs;
};
