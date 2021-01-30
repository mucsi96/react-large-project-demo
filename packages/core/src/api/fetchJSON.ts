import { ajax, AjaxError } from 'rxjs/ajax';
import { ApiError, ApiErrorResponse } from './types';

export async function fetchJSON<T, B>(
  url: string,
  init: { method?: string; headers?: Record<string, string>; body?: B } = {}
): Promise<T> {
  const { method, headers, body } = init;
  try {
    const result = await ajax({
      url,
      ...(method && { method }),
      ...(body && { body }),
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }).toPromise();

    return result.response as T;
  } catch (error) {
    const ajaxError = error as AjaxError;
    // eslint-disable-next-line no-throw-literal
    throw {
      message: ajaxError.message,
      response: ajaxError.response as ApiErrorResponse,
      status: ajaxError.status,
    } as ApiError;
  }
}
