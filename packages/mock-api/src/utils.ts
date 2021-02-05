import { Key, pathToRegexp } from 'path-to-regexp';
import { getMocks } from './mocks';
import { MockWithRegexp } from './types';

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

export function getParams(
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

export function getQuery(
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
