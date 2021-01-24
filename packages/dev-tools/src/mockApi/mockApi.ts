import { Mock, MockMethod, MockWithRegexp } from './types';
import { findMatchingMock, getParams, getQuery } from './utils';

let mocks: Mock[] = [];
const mockSwitches = getInitialMockSwitches();
const hasInitialMockSwitches = !!Object.keys(mockSwitches).length;

type RawRequest = {
  url: string;
  method: MockMethod;
  body: string;
  headers: Record<string, string | string[]>;
};

export async function enableMockApi(): Promise<void> {
  navigator.serviceWorker
    .register('mockApiServiceWorker.js', { scope: './' })
    .catch((err) => console.error('error registering sw', err));

  await new Promise<void>((resolve) => {
    navigator.serviceWorker.onmessage = ({
      data,
    }: {
      data?: { type?: string };
    }) => {
      if (data && data.type === 'READY') {
        console.log('SW is ready. Registered mocks', mocks);
        resolve();
      }
    };
  });

  navigator.serviceWorker.onmessage = ({
    data,
    ports,
  }: {
    data?: { type?: string; request: RawRequest };
    ports: ReadonlyArray<MessagePort>;
  }) => {
    if (data && data.type === 'REQUEST') {
      return handleRequest({ ...data.request, port: ports[0], mocks });
    }
  };
}

export function registerApiMocks(newMocks: Mock[]): void {
  mocks = [...mocks, ...newMocks];
}

export function getInitialMockSwitches(): Record<string, string> {
  const searchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    [...searchParams.entries()]
      .filter(([name]) => name === 'mock')
      .map(([, value]) => value.split('--'))
  ) as Record<string, string>;
}

export function setMockSwitch(name: string, value: string): void {
  if (hasInitialMockSwitches) {
    return;
  }

  mockSwitches[name] = value;
}

export function getMockSwitch(name: string): string {
  return mockSwitches[name];
}

async function handleRequest({
  url: fullUrl,
  method,
  body,
  headers,
  port,
  mocks,
}: {
  url: string;
  method: MockMethod;
  body: string;
  headers: Record<string, string | string[]>;
  port: MessagePort;
  mocks: Mock[];
}) {
  const url = new URL(fullUrl);
  const { match, mock } = findMatchingMock(mocks, url, method);

  if (!match || !mock) {
    return port.postMessage({
      type: 'MOCK_NOT_FOUND',
    });
  }

  const response = await createMockResponse({
    mock,
    match,
    method,
    headers,
    url,
    body,
  });

  port.postMessage({
    response,
    type: 'MOCK_SUCCESS',
  });
}

export async function createMockResponse({
  mock,
  match,
  url,
  method,
  body,
  headers,
}: {
  mock: MockWithRegexp;
  match: RegExpExecArray;
  url: URL;
  method: MockMethod;
  body: string;
  headers: Record<string, string | string[]>;
}): Promise<{ body: unknown; status: number }> {
  let status = 200;
  let delay: number | undefined;
  let mockError = false;
  let mockHTML = false;
  let responseBody = await mock.callback(
    {
      url: url.pathname,
      method,
      headers,
      body: body && (JSON.parse(body) as unknown),
      params: getParams(match, mock),
      query: getQuery(url.searchParams),
    },
    {
      status(statusCode: number) {
        status = statusCode;
      },
      delay(delayMs: number) {
        delay = delayMs;
      },
      mockError(enable: boolean) {
        mockError = enable;
      },
      mockHTML(enable: boolean) {
        mockHTML = enable;
      },
    }
  );

  if (mockError) {
    responseBody = {
      error: { message: "We couldn't process your request at this time" },
    };
  }

  if (delay) {
    await new Promise((resolve) => window.setTimeout(resolve, delay));
  }

  return {
    body: mockHTML
      ? '<html></html>'
      : responseBody && JSON.stringify(responseBody),
    status: mockError ? 500 : status,
  };
}
