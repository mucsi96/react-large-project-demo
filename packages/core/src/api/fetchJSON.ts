import { ApiError, ApiErrorResponse } from './types';

export async function fetchJSON<T>(
  url: string,
  init: {
    method?: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
  } = {}
): Promise<T> {
  const { method, headers, body } = init;
  const response = await window.fetch(url, {
    ...(method && { method }),
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  const textResult = await response.text();
  const result = (textResult ? JSON.parse(textResult) : null) as T;

  if (!response.ok) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: 'Failed to fetch data',
      response: result as ApiErrorResponse,
      status: response.status,
    } as ApiError;
  }

  return result;
}
