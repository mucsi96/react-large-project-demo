import {
  getMockSwitch,
  registerApiMocks,
  MockRequest,
  MockResponse,
} from 'dev-tools';
import mockFriends from './mockFriends';
import { FriendsResponse } from './types';

export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/api/friends',
      callback: getFriends,
    },
  ]);
}

function getFriends({ query }: MockRequest, response: MockResponse) {
  switch (getMockSwitch('friends')) {
    case 'loadingFailure':
      return response.mockError(true);
    default:
      const from = parseInt((query.from as string) ?? '0');
      const to = from + 5;
      return {
        _embedded: mockFriends.slice(from, to),
        _links: {
          next: mockFriends[to]
            ? {
                href: `/api/friends?from=${to}`,
              }
            : undefined,
        },
      } as FriendsResponse;
  }
}
