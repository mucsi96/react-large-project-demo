/* eslint-disable @typescript-eslint/no-empty-function */
import { act } from 'react-dom/test-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asMock<F extends (...args: any[]) => any>(
  f: F
): jest.MockedFunction<F> {
  return f as jest.MockedFunction<F>;
}

export type MockPromise<T> = Promise<T> & {
  resolve: (value: T) => Promise<void>;
  reject: (error: Error) => Promise<void>;
};

export function createMockPromise<T>(): MockPromise<T> {
  let resolveMockPromise: (value: T) => void = () => {};
  let rejectMockPromise: (error: Error) => void = () => {};

  const mockPromise = new Promise((resolve, reject) => {
    resolveMockPromise = resolve;
    rejectMockPromise = reject;
  }) as MockPromise<T>;

  mockPromise.resolve = (value: T) =>
    act(async () => {
      resolveMockPromise(value);
      await mockPromise;
    });
  mockPromise.reject = (error: Error) =>
    act(async () => {
      rejectMockPromise(error);
      try {
        await mockPromise;
      } catch {}
    });

  return mockPromise;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const waitFor = (callback: Function, { interval = 50, timeout = 1000 } = {}): Promise<undefined> =>
  act(
    () =>
      new Promise((resolve, reject) => {
        const startTime = Date.now();

        const nextInterval = () => {
          setTimeout(() => {
            try {
              callback();
              resolve();
            } catch (err) {
              if (Date.now() - startTime > timeout) {
                reject(new Error('Timed out.'));
              } else {
                nextInterval();
              }
            }
          }, interval);
        };

        nextInterval();
      })
  );
