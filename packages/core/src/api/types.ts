export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type CallApiOptions = {
  href: string;
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

export type ApiState<FetchArgs extends unknown[], ResponseBody> = {
  data?: ResponseBody;
  error?: ApiError;
  isLoading: boolean;
  fetchArgs?: FetchArgs;
};
