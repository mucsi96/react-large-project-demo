/* eslint-disable @typescript-eslint/no-empty-function */
import http, { ClientRequest, IncomingMessage } from 'http';
import { RequestOptions } from 'https';
import { Readable, Writable } from 'stream';
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

    return createRequest({ options, href, method, headers });
  };
}

function createRequest({
  options,
  href,
  method,
  headers,
}: {
  options: RequestOptions;
  href: string;
  method: string;
  headers?: http.OutgoingHttpHeaders;
}) {
  const bodyChunks: Buffer[] = [];
  const clientRequest = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      bodyChunks.push(chunk);
      if (callback) {
        callback();
      }
    },
    final(callback) {
      handleRequest({
        method: method as MockMethod,
        headers: headers as Record<string, string | string[]>,
        url: new URL(href),
        body: Buffer.concat(bodyChunks).toString('utf-8'),
      })
        .then(({ body, status }) => {
          clientRequest.emit(
            'response',
            createResponse({ body, options, status })
          );
          if (callback) {
            callback();
          }
        })
        .catch((error) => {
          console.error(error);
          if (callback) {
            callback(error);
          }
        });
    },
  }) as ClientRequest;
  return clientRequest;
}

async function handleRequest({
  method,
  headers,
  url,
  body,
}: {
  method: MockMethod;
  headers: Record<string, string | string[]>;
  url: URL;
  body: string;
}) {
  const { match, mock } = findMatchingMock(url, method);

  if (!match || !mock) {
    throw new Error(`No matching mock for ${method} ${url.pathname}`);
  }
  return await createMockResponse({
    mock,
    match,
    method,
    headers,
    url,
    body,
  });
}

function createResponse({
  options,
  body,
  status,
}: {
  options: RequestOptions;
  body: string;
  status: number;
}) {
  const response = Readable.from([
    Buffer.from(body, 'utf-8'),
  ]) as IncomingMessage & {
    request: RequestOptions;
  };

  response.request = options;
  response.statusCode = status;
  response.headers = {};
  response.rawHeaders = [];
  return response;
}
