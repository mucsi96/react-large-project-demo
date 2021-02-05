import { MockMethod, MockWithRegexp } from './types';
import { Key, pathToRegexp } from 'path-to-regexp';
import { getMocks, getMockApiDelay } from './mocks';

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
}): Promise<{ body: string; status: number }> {
  let status = 200;
  let delay = getMockApiDelay();
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
      : responseBody
      ? JSON.stringify(responseBody)
      : '',
    status: mockError ? 500 : status,
  };
}

export function findMatchingMock(
  url: URL,
  method: string
): { match: RegExpExecArray | null; mock: MockWithRegexp | null } {
  const mock = getMocks()
    .map((mock) => {
      const keys: Key[] = [];
      const regexp = pathToRegexp(mock.path, keys);

      return {
        regexp,
        keys: keys.map((key) => key.name),
        ...mock,
      };
    })
    .find(
      (mock) =>
        mock.regexp.test(url.pathname) && (mock.method || 'GET') === method
    ) as MockWithRegexp;
  const match = mock && mock.regexp.exec(url.pathname);
  return { match, mock };
}

function getParams(
  match: RegExpExecArray,
  mock: MockWithRegexp
): Record<string, string> {
  return match.reduce((acc, val, i) => {
    const prop = mock.keys[i - 1];

    if (!prop) {
      return acc;
    }

    if (val !== undefined || !(prop in acc)) {
      acc[prop] = val;
    }

    return acc;
  }, {} as Record<string, string>);
}

function getQuery(
  searchParams: URLSearchParams
): Record<string, string | string[]> {
  const query = {} as Record<string, string | string[]>;

  searchParams.forEach((value, name) => {
    if (Array.isArray(query[name])) {
      query[name] = [...query[name], value];
      return;
    }

    if (query[name]) {
      query[name] = [query[name] as string, value];
      return;
    }

    query[name] = value;
  });
  return query;
}
