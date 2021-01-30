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
