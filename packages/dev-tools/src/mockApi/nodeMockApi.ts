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

    return {
      on(event: string, callback: (res: IncomingMessage) => void) {
        if (event === 'response') {
          handleRequest({
            method: method as MockMethod,
            headers: headers as Record<string, string | string[]>,
            url: new URL(href),
            options,
            callback,
          });
        }
      },
      abort() {},
      end() {},
    } as ClientRequest;
  };
}

function handleRequest({
  method,
  headers,
  url,
  options,
  callback,
}: {
  method: MockMethod;
  headers: Record<string, string | string[]>;
  url: URL;
  options: RequestOptions;
  callback: (res: IncomingMessage) => void;
}) {
  const { match, mock } = findMatchingMock(url, method);

  if (!match || !mock) {
    return;
  }
  createMockResponse({
    mock,
    match,
    method,
    headers,
    url,
    body: '',
  })
    .then(({ body, status }) => {
      const response = IncomingMessage.from([
        Buffer.from(body, 'utf-8'),
      ]) as IncomingMessage & {
        request: RequestOptions;
      };
      response.request = options;
      response.statusCode = status;
      response.headers = {};
      response.rawHeaders = [];
      callback(response);
    })
    .catch((err) => console.error(err));
}
