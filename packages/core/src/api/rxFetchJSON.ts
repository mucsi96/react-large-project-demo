import { ajax, AjaxError } from 'rxjs/ajax';
import { ApiError, ApiErrorResponse, CallApiOptions } from './types';

export async function rxFetchJSON<ResponseBody>({
  href,
  method,
  headers,
  body,
}: CallApiOptions): Promise<ResponseBody> {
  try {
    const result = await ajax({
      url: href,
      ...(method && { method }),
      ...(body ? { body } : {}),
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }).toPromise();

    return result.response as ResponseBody;
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
