/* eslint-disable @typescript-eslint/unbound-method */
import { useApi } from '../api';
import { asMock, createMockPromise, Fetch } from 'core';
import React, { FC } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ApiError } from './types';

describe('useApi', () => {
  function mountHook(
    fetcher: (fetch: Fetch, input: string) => Promise<string>,
    options?: { cache?: RequestCache }
  ) {
    let hookResult: {
      fetch: (input: string) => void;
      data?: string;
      error?: ApiError;
      isLoading: boolean;
    };

    const TestComponent: FC = () => {
      hookResult = useApi(window.fetch, fetcher, options);
      return null;
    };
    mount(<TestComponent />);

    return {
      getHookResult() {
        return hookResult;
      },
    };
  }

  function setupMocks() {
    window.fetch = jest.fn();
    const mockPromise = createMockPromise<string>();
    const fetcher = jest.fn().mockReturnValue(mockPromise) as (
      fetch: Fetch,
      input: string
    ) => Promise<string>;

    return {
      mockPromise,
      fetcher,
    };
  }

  describe('fetch function', () => {
    test('passes through the arguments to fetcher', async () => {
      const { fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher, { cache: 'no-store' });
      act(() => {
        getHookResult().fetch('test input');
      });
      expect(fetcher).toHaveBeenCalledWith(expect.any(Function), 'test input');
      await asMock(fetcher).mock.calls[0][0]('/test/url', {
        method: 'POST',
        body: 'test body',
      });
      expect(window.fetch).toHaveBeenCalledWith('/test/url', {
        method: 'POST',
        body: 'test body',
        cache: 'no-store',
      });
    });
  });

  describe('isLoading property', () => {
    test('is false before fetch is called', () => {
      const { fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      expect(getHookResult().isLoading).toBe(false);
    });

    test('is true during fetch', () => {
      const { fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      expect(getHookResult().isLoading).toBe(true);
    });

    test('is false after fetch success', async () => {
      const { mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.resolve('');
      expect(getHookResult().isLoading).toBe(false);
    });

    test('is false after fetch failure', async () => {
      const { mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.reject(new Error());
      expect(getHookResult().isLoading).toBe(false);
    });
  });

  describe('data property', () => {
    test('is undefined before fetch is called', () => {
      const { fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      expect(getHookResult().data).toBeUndefined();
    });

    test('is undefined during fetch', () => {
      const { fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      expect(getHookResult().data).toBeUndefined();
    });

    test('is set after fetch success', async () => {
      const { mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.resolve('success response');
      expect(getHookResult().data).toBe('success response');
    });

    test('is undefined after fetch failure', async () => {
      const { mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.reject(new Error());
      expect(getHookResult().data).toBeUndefined();
    });
  });

  describe('error property', () => {
    test('is undefined before fetch is called', () => {
      const { fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      expect(getHookResult().error).toBeUndefined();
    });

    test('is undefined during fetch', () => {
      const { fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      expect(getHookResult().error).toBeUndefined();
    });

    test('is undefined after fetch success', async () => {
      const { mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.resolve('success response');
      expect(getHookResult().error).toBeUndefined();
    });

    test('is set after fetch failure', async () => {
      const mockError = new Error();
      const { mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.reject(mockError);
      expect(getHookResult().error).toBe(mockError);
    });
  });
});
