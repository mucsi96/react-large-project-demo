import { Key, pathToRegexp } from "path-to-regexp";
import { Mock, MockMethod, MockWithRegexp } from "./types";

export function findMatchingMock(mocks: Mock[], url: URL, method: string) {
  const mock = mocks
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
        mock.regexp.test(url.pathname) && (mock.method || "GET") === method
    ) as MockWithRegexp;
  const match = mock && mock.regexp.exec(url.pathname);
  return { match, mock };
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
}) {
  let status = 200;
  let delay: number | undefined;
  let mockError = false;
  let mockHTML = false;
  let responseBody = await mock.callback(
    {
      url: url.pathname,
      method,
      headers,
      body: body && JSON.parse(body),
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
      ? "<html></html>"
      : responseBody && JSON.stringify(responseBody),
    status: mockError ? 500 : status,
  };
}

function getParams(match: RegExpExecArray, mock: MockWithRegexp) {
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

function getQuery(searchParams: URLSearchParams) {
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
