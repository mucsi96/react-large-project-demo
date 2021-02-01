/* eslint-disable @typescript-eslint/no-empty-function */
import http, { ClientRequest, IncomingMessage } from 'http';
import { RequestOptions } from 'https';
import { URL } from 'url';
import { createMockResponse, findMatchingMock } from './mockApi';
import { MockMethod } from './types';

export function enableNodeMockApi(): void {
  http.request = (options: RequestOptions | string | URL): ClientRequest => {
    if (options instanceof URL || typeof options === 'string') {
      throw new Error('Not implemented');
    }

    const {
      uri: { href },
      method = 'GET',
      headers,
    } = options as RequestOptions & {
      uri: { href: string };
    };
    const bodyChunks: Buffer[] = [];
    let sendResponse: (res: IncomingMessage) => void;

    return {
      on(event: string, callback: (res: IncomingMessage) => void) {
        if (event === 'response') {
          sendResponse = callback;
        }
      },
      abort() {},
      end() {
        handleRequest({
          method: method as MockMethod,
          headers: headers as Record<string, string | string[]>,
          url: new URL(href),
          request: options,
          body: Buffer.concat(bodyChunks).toString('utf-8'),
        })
          .then(sendResponse)
          .catch((error) => console.error(error));
      },
      write(chunk: Buffer) {
        bodyChunks.push(chunk);
      },
    } as ClientRequest;
  };
}

async function handleRequest({
  method,
  headers,
  url,
  request,
  body,
}: {
  method: MockMethod;
  headers: Record<string, string | string[]>;
  url: URL;
  body: string;
  request: RequestOptions;
}) {
  const { match, mock } = findMatchingMock(url, method);

  if (!match || !mock) {
    throw new Error(`No matching mock for ${method} ${url.pathname}`);
  }
  const result = await createMockResponse({
    mock,
    match,
    method,
    headers,
    url,
    body,
  });

  const response = IncomingMessage.from([
    Buffer.from(result.body, 'utf-8'),
  ]) as IncomingMessage & {
    request: RequestOptions;
  };
  response.request = request;
  response.statusCode = result.status;
  response.headers = {};
  response.rawHeaders = [];

  return response;
}
