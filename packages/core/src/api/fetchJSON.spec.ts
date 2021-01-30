import { Observable } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { fetchJSON } from './fetchJSON';
import { asMock } from 'dev-tools';
import { ApiError } from './types';

jest.mock('rxjs/ajax');

describe('fetchJSON', () => {
  test('fetches using rxjs ajax', async () => {
    asMock(ajax).mockReturnValue({
      toPromise: () => Promise.resolve({ response: { test: 'response' } }),
    } as Observable<AjaxResponse>);
    const response = await fetchJSON('/test/url');

    expect(response).toEqual({ test: 'response' });
    expect(ajax).toHaveBeenCalledWith({
      url: '/test/url',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('handles changing method, body and headers', async () => {
    asMock(ajax).mockReturnValue({
      toPromise: () => Promise.resolve({ response: { test: 'response' } }),
    } as Observable<AjaxResponse>);
    const response = await fetchJSON('/test/url', {
      method: 'POST',
      body: { test: 'body' },
      headers: { 'x-header-1': 'test value' },
    });

    expect(response).toEqual({ test: 'response' });
    expect(ajax).toHaveBeenCalledWith({
      url: '/test/url',
      method: 'POST',
      body: { test: 'body' },
      headers: {
        'Content-Type': 'application/json',
        'x-header-1': 'test value',
      },
    });
  });

  test('throw ApiError in case of an error', async () => {
    asMock(ajax).mockReturnValue(({
      toPromise: () =>
        Promise.reject({
          message: 'test error message',
          status: 500,
          response: { error: 'response' },
        }),
    } as unknown) as Observable<AjaxResponse>);

    let coughtError: ApiError | null = null;

    try {
      await fetchJSON('/test/url');
    } catch (err) {
      coughtError = err as ApiError;
    }

    expect(coughtError).toEqual({
      message: 'test error message',
      status: 500,
      response: { error: 'response' },
    });
  });
});
