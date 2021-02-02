/* eslint-disable @typescript-eslint/no-empty-function */
import http, { ClientRequest, IncomingMessage } from 'http';
import { RequestOptions } from 'https';
import { finished, Readable, Writable } from 'stream';
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
          request: options,
          body: Buffer.concat(bodyChunks).toString('utf-8'),
        })
          .then((response) => {
            clientRequest.emit('response', response);
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
