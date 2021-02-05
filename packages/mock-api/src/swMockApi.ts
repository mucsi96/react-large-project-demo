import { createMockResponse } from './mockApi';
import { getMocks } from './mocks';
import { MockMethod } from './types';
import { findMatchingMock } from './utils';

type RawRequest = {
  url: string;
  method: MockMethod;
  body: string;
  headers: Record<string, string | string[]>;
};

export async function enableSwMockApi(): Promise<void> {
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
        console.log('SW is ready. Registered mocks', getMocks());
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
      return handleRequest({ ...data.request, port: ports[0] });
    }
  };
}

async function handleRequest({
  url: fullUrl,
  method,
  body,
  headers,
  port,
}: {
  url: string;
  method: MockMethod;
  body: string;
  headers: Record<string, string | string[]>;
  port: MessagePort;
}): Promise<void> {
  const url = new URL(fullUrl);
  const { match, mock } = findMatchingMock(url, method);

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
