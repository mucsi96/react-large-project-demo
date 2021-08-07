import { fetchJSON } from './fetchJSON';
import { asMock } from 'core';
import { ApiError } from './types';

window.fetch = jest.fn();

describe('fetchJSON', () => {
  test('fetches using rxjs ajax', async () => {
    asMock(window.fetch).mockResolvedValue(({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(JSON.stringify({ test: 'response' })),
    } as unknown) as Response);
    const response = await fetchJSON({ href: '/test/url' });

    expect(response).toEqual({ test: 'response' });
    expect(window.fetch).toHaveBeenCalledWith('/test/url', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('handles changing method, body and headers', async () => {
    asMock(window.fetch).mockResolvedValue(({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(JSON.stringify({ test: 'response' })),
    } as unknown) as Response);
    const response = await fetchJSON({
      href: '/test/url',
      method: 'POST',
      body: { test: 'body' },
      headers: { 'x-header-1': 'test value' },
    });

    expect(response).toEqual({ test: 'response' });
    expect(window.fetch).toHaveBeenCalledWith('/test/url', {
      method: 'POST',
      body: JSON.stringify({ test: 'body' }),
      headers: {
        'Content-Type': 'application/json',
        'x-header-1': 'test value',
      },
    });
  });

  test('throw ApiError in case of an error', async () => {
    asMock(window.fetch).mockResolvedValue(({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue(JSON.stringify({ error: 'response' })),
    } as unknown) as Response);

    let coughtError: ApiError | null = null;

    try {
      await fetchJSON({ href: '/test/url' });
    } catch (err) {
      coughtError = err as ApiError;
    }

    expect(coughtError).toEqual({
      message: 'Failed to fetch data',
      status: 500,
      response: { error: 'response' },
    });
  });
});
