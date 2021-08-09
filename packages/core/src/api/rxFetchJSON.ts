import { ajax, AjaxError } from 'rxjs/ajax';
import { ApiError, ApiErrorResponse, CallApiOptions } from './types';

export async function rxFetchJSON<ResponseBody>({
  href,
  queryParams = {},
  method,
  headers,
  body,
  signal,
}: CallApiOptions): Promise<ResponseBody> {
  try {
    const search = Object.entries(queryParams)
      .reduce((params, [key, value]) => {
        params.set(key, value);
        return params;
      }, new URLSearchParams())
      .toString();
    const paramsSeparator = href.includes('?') ? '&' : '?';
    const result = await ajax({
      url: [href, search].filter(Boolean).join(paramsSeparator),
      ...(method && { method }),
      ...(body ? { body } : {}),
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }).toPromise();

    if (signal?.aborted) {
      throw new DOMException('Abort', 'AbortError')
    }

    return result.response as ResponseBody;
  } catch (err) {
    const error = err as AjaxError & { name: string };

    if (error.name === 'AbortError') {
      throw error;
    }

    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.message,
      response: error.response as ApiErrorResponse,
      status: error.status,
    } as ApiError;
  }
}
