import { ApiError, ApiErrorResponse, CallApiOptions } from './types';

export async function fetchJSON<ResponseBody>({
  href,
  queryParams = {},
  method,
  headers,
  body,
  signal,
}: CallApiOptions): Promise<ResponseBody> {
  const search = Object.entries(queryParams)
    .reduce((params, [key, value]) => {
      params.set(key, value);
      return params;
    }, new URLSearchParams())
    .toString();
  const paramsSeparator = href.includes('?') ? '&' : '?';
  const response = await window.fetch(
    [href, search].filter(Boolean).join(paramsSeparator),
    {
      ...(method && { method }),
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(signal && { signal }),
    }
  );

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
