export type CallApiOptions = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  signal?: AbortSignal | null;
  body?: unknown;
}

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
