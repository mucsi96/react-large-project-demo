import { ApiError, ApiErrorResponse, CallApiOptions } from './types';

export async function fetchJSON<ResponseBody>(
  { href, method, headers, body }: CallApiOptions
): Promise<ResponseBody> {
  const response = await window.fetch(href, {
    ...(method && { method }),
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const textResult = await response.text();
  const result = (textResult ? JSON.parse(textResult) : null) as ResponseBody;

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
