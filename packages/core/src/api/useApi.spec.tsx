import { act, renderHook } from '@testing-library/react-hooks';
import { useApi } from './useApi';
import { ApiCaller, FetchState } from './types';

class MockAbortController {
  static aborted = false;
  signal = 'mockMockAbortControllerSignal';

  abort() {
    MockAbortController.aborted = true;
  }
}

describe('useApi', () => {
  function setupMocks({ fail }: { fail?: boolean } = {}) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    window.AbortController = MockAbortController as any;
    const callApi = !fail
      ? (jest.fn().mockResolvedValue({ test: 'response' }) as ApiCaller)
      : (jest.fn().mockRejectedValue(new Error('api error')) as ApiCaller);
    const fetcher = jest.fn().mockImplementation(() =>
      callApi({
        href: '/test/url',
        method: 'POST',
        body: 'test body',
      })
    ) as (callApi: ApiCaller, input: string) => Promise<string>;

    return {
      callApi,
      fetcher,
    };
  }

  describe('fetch function', () => {
    test('passes through the arguments to fetcher', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('test input');
      });
      expect(fetcher).toHaveBeenCalledWith(expect.any(Function), 'test input');
      await waitForNextUpdate();
      expect(callApi).toHaveBeenCalledWith({
        href: '/test/url',
        method: 'POST',
        body: 'test body',
      });
    });

    test('passes through the cache options to api caller', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher, { cache: true })
      );
      act(() => {
        result.current[0]('test input');
      });
      await waitForNextUpdate();
      expect(callApi).toHaveBeenCalledWith({
        href: '/test/url',
        method: 'POST',
        body: 'test body'
      });
    });

    test('aborts api call on unmount', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, unmount, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('test input');
      });
      await waitForNextUpdate();
      MockAbortController.aborted = false;
      unmount();
      expect(MockAbortController.aborted).toBe(true);
    });

    test('aborts api call on subsequent api call', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('test input');
      });
      await waitForNextUpdate();
      MockAbortController.aborted = false;
      act(() => {
        result.current[0]('test input');
      });
      expect(MockAbortController.aborted).toBe(true);
      await waitForNextUpdate();
    });

    test('doesn`t aborts api call on subsequent api call if noAbortOnSubsequentCall is set', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher, { noAbortOnSubsequentCall: true })
      );
      act(() => {
        result.current[0]('test input');
      });
      await waitForNextUpdate();
      MockAbortController.aborted = false;
      act(() => {
        result.current[0]('test input');
      });
      expect(MockAbortController.aborted).toBe(false);
      await waitForNextUpdate();
    });
  });

  describe('fetchState property', () => {
    test('is undefined before fetch is called', () => {
      const { callApi, fetcher } = setupMocks();
      const { result } = renderHook(() => useApi(callApi, fetcher));
      expect(result.current[1].fetchState).toBeUndefined();
    });

    test('is LOADING during fetch', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() => useApi(callApi, fetcher));
      act(() => {
        result.current[0]('');
      });
      expect(result.current[1].fetchState).toBe(FetchState.LOADING);
      await waitForNextUpdate()
    });

    test('is READY after fetch success', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('');
      });
      await waitForNextUpdate();
      expect(result.current[1].fetchState).toBe(FetchState.READY);
    });

    test('is FAILED after fetch failure', async () => {
      const { callApi, fetcher } = setupMocks({ fail: true });
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('');
      });
      await waitForNextUpdate();
      expect(result.current[1].fetchState).toBe(FetchState.FAILED);
    });
  });

  describe('data property', () => {
    test('is undefined before fetch is called', () => {
      const { callApi, fetcher } = setupMocks();
      const { result } = renderHook(() => useApi(callApi, fetcher));
      expect(result.current[1].data).toBeUndefined();
    });

    test('is undefined during fetch', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() => useApi(callApi, fetcher));
      act(() => {
        result.current[0]('');
      });
      expect(result.current[1].data).toBeUndefined();
      await waitForNextUpdate()
    });

    test('is set after fetch success', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('');
      });
      await waitForNextUpdate();
      expect(result.current[1].data).toEqual({ test: 'response' });
    });

    test('is undefined after fetch failure', async () => {
      const { callApi, fetcher } = setupMocks({ fail: true });
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('');
      });
      await waitForNextUpdate();
      expect(result.current[1].data).toBeUndefined();
    });
  });

  describe('error property', () => {
    test('is undefined before fetch is called', () => {
      const { callApi, fetcher } = setupMocks();
      const { result } = renderHook(() => useApi(callApi, fetcher));
      expect(result.current[1].error).toBeUndefined();
    });

    test('is undefined during fetch', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() => useApi(callApi, fetcher));
      act(() => {
        result.current[0]('');
      });
      expect(result.current[1].error).toBeUndefined();
      await waitForNextUpdate();
    });

    test('is undefined after fetch success', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('');
      });
      await waitForNextUpdate();
      expect(result.current[1].error).toBeUndefined();
    });

    test('is set after fetch failure', async () => {
      const { callApi, fetcher } = setupMocks({ fail: true });
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('');
      });
      await waitForNextUpdate();
      expect(result.current[1].error?.message).toEqual('api error');
    });
  });

  describe('fetchArgs property', () => {
    test('is undefined before fetch is called', () => {
      const { callApi, fetcher } = setupMocks();
      const { result } = renderHook(() => useApi(callApi, fetcher));
      expect(result.current[1].fetchArgs).toBeUndefined();
    });

    test('is undefined during fetch', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() => useApi(callApi, fetcher));
      act(() => {
        result.current[0]('');
      });
      expect(result.current[1].fetchArgs).toBeUndefined();
      await waitForNextUpdate();
    });

    test('is the original fetch args after fetch success', async () => {
      const { callApi, fetcher } = setupMocks();
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('test input');
      });
      await waitForNextUpdate();
      expect(result.current[1].fetchArgs).toEqual(['test input']);
    });

    test('is the original fetch args after fetch failure', async () => {
      const { callApi, fetcher } = setupMocks({ fail: true });
      const { result, waitForNextUpdate } = renderHook(() =>
        useApi(callApi, fetcher)
      );
      act(() => {
        result.current[0]('test input');
      });
      await waitForNextUpdate();
      expect(result.current[1].fetchArgs).toEqual(['test input']);
    });
  })
});
