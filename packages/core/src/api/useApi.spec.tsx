/* eslint-disable @typescript-eslint/unbound-method */
import { useApi } from '../api';
import { asMock, createMockPromise } from 'core';
import React, { FC } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ApiCaller, ApiError } from './types';

describe('useApi', () => {
  function mountHook(
    callApi: ApiCaller,
    fetcher: (callApi: ApiCaller, input: string) => Promise<string>
  ) {
    let hookResult: {
      fetch: (input: string) => void;
      data?: string;
      error?: ApiError;
      isLoading: boolean;
    };

    const TestComponent: FC = () => {
      hookResult = useApi(callApi, fetcher);
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
    const callApi = jest
      .fn()
      .mockResolvedValue({ test: 'response' }) as ApiCaller;
    const mockPromise = createMockPromise<string>();
    const fetcher = jest.fn().mockReturnValue(mockPromise) as (
      callApi: ApiCaller,
      input: string
    ) => Promise<string>;

    return {
      callApi,
      mockPromise,
      fetcher,
    };
  }

  describe('fetch function', () => {
    test('passes through the arguments to fetcher', async () => {
      const { callApi, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('test input');
      });
      expect(fetcher).toHaveBeenCalledWith(expect.any(Function), 'test input');
      await asMock(fetcher).mock.calls[0][0]({
        href: '/test/url',
        method: 'POST',
        body: 'test body',
      });
      expect(callApi).toHaveBeenCalledWith({
        href: '/test/url',
        method: 'POST',
        body: 'test body',
        signal: expect.any(AbortSignal) as AbortSignal,
      });
    });
  });

  describe('isLoading property', () => {
    test('is false before fetch is called', () => {
      const { callApi, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      expect(getHookResult().isLoading).toBe(false);
    });

    test('is true during fetch', () => {
      const { callApi, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      expect(getHookResult().isLoading).toBe(true);
    });

    test('is false after fetch success', async () => {
      const { callApi, mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.resolve('');
      expect(getHookResult().isLoading).toBe(false);
    });

    test('is false after fetch failure', async () => {
      const { callApi, mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.reject(new Error());
      expect(getHookResult().isLoading).toBe(false);
    });
  });

  describe('data property', () => {
    test('is undefined before fetch is called', () => {
      const { callApi, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      expect(getHookResult().data).toBeUndefined();
    });

    test('is undefined during fetch', () => {
      const { callApi, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      expect(getHookResult().data).toBeUndefined();
    });

    test('is set after fetch success', async () => {
      const { callApi, mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.resolve('success response');
      expect(getHookResult().data).toBe('success response');
    });

    test('is undefined after fetch failure', async () => {
      const { callApi, mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.reject(new Error());
      expect(getHookResult().data).toBeUndefined();
    });
  });

  describe('error property', () => {
    test('is undefined before fetch is called', () => {
      const { callApi, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      expect(getHookResult().error).toBeUndefined();
    });

    test('is undefined during fetch', () => {
      const { callApi, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      expect(getHookResult().error).toBeUndefined();
    });

    test('is undefined after fetch success', async () => {
      const { callApi, mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.resolve('success response');
      expect(getHookResult().error).toBeUndefined();
    });

    test('is set after fetch failure', async () => {
      const mockError = new Error();
      const { callApi, mockPromise, fetcher } = setupMocks();
      const { getHookResult } = mountHook(callApi, fetcher);
      act(() => {
        getHookResult().fetch('');
      });
      await mockPromise.reject(mockError);
      expect(getHookResult().error).toBe(mockError);
    });
  });
});
