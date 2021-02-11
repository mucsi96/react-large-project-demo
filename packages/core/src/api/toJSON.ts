import { ApiError, ApiErrorResponse } from './types';

export async function toJSON<T>(
  responsePromise: Promise<Response>
): Promise<T> {
  const response = await responsePromise;
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
