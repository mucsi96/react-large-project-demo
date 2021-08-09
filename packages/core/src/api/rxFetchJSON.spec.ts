import { Observable } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { asMock } from '../testUtils';
import { rxFetchJSON } from './rxFetchJSON';
import { ApiError } from './types';

jest.mock('rxjs/ajax');

describe('rxfetchJSON', () => {
  test('fetches using rxjs ajax', async () => {
    asMock(ajax).mockReturnValue({
      toPromise: () => Promise.resolve({ response: { test: 'response' } }),
    } as Observable<AjaxResponse>);
    const response = await rxFetchJSON({ href: '/test/url' });

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
    const response = await rxFetchJSON({
      href: '/test/url',
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

  test('handles query params', async () => {
    asMock(ajax).mockReturnValue({
      toPromise: () => Promise.resolve({ response: { test: 'response' } }),
    } as Observable<AjaxResponse>);
    await rxFetchJSON({
      href: '/test/url',
      queryParams: {
        a: '1',
        b: '2',
      },
    });

    expect(ajax).toHaveBeenCalledWith({
      url: '/test/url?a=1&b=2',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('handles query params in href', async () => {
    asMock(ajax).mockReturnValue({
      toPromise: () => Promise.resolve({ response: { test: 'response' } }),
    } as Observable<AjaxResponse>);
    await rxFetchJSON({
      href: '/test/url?a=1',
      queryParams: {
        b: '2',
        c: '3',
      },
    });

    expect(ajax).toHaveBeenCalledWith({
      url: '/test/url?a=1&b=2&c=3',
      headers: {
        'Content-Type': 'application/json',
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
      await rxFetchJSON({ href: '/test/url' });
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
