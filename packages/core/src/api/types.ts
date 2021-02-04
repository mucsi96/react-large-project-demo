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

export type ApiState<A extends unknown[], T> = {
  data?: T;
  error?: ApiError;
  isLoading: boolean;
  fetchArgs?: A;
};

export type FetchApiStartAction = {
  type: 'FETCH_API_START';
};

export type FetchApiSucceedAction<A extends unknown[], T> = {
  type: 'FETCH_API_SUCCEED';
  payload: T;
  fetchArgs: A;
};

export type FetchApiFailedAction<A extends unknown[]> = {
  type: 'FETCH_API_FAILED';
  error: ApiError;
  fetchArgs: A;
};

export type FetchApiAction<A extends unknown[], T> =
  | FetchApiStartAction
  | FetchApiSucceedAction<A, T>
  | FetchApiFailedAction<A>;
