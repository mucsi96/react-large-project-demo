import {
  getMockSwitch,
  registerApiMocks,
  MockRequest,
  MockResponse,
  loadFromMockDB,
  saveInMockDB,
  setMockSwitch,
} from 'mock-api';
import mockFriends from './mockFriends';
import { FriendsResponse } from './types';

export enum FriendsMockSwitch {
  NORMAL = 'NORMAL',
  EMPTY = 'EMPTY',
  LOADING_FAILURE = 'LOADING_FAILURE',
  PROCESSING_FAILURE = 'PROCESSING_FAILURE',
  SLOW = 'SLOW',
}

export function setFriendsMockSwitch(mockSwitch: FriendsMockSwitch): void {
  setMockSwitch('friends', mockSwitch);
}

export function getFriendsMockSwitck(): FriendsMockSwitch {
  return getMockSwitch('friends') as FriendsMockSwitch;
}

export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/api/friends',
      callback: getFriends,
    },
    {
      path: '/api/friends/:id/add-to-favorite',
      method: 'POST',
      callback: addToFavorite,
    },
    {
      path: '/api/friends/:id/remove-from-favorite',
      method: 'POST',
      callback: removeFromFavorite,
    },
  ]);
}

function getFriends({ query }: MockRequest, response: MockResponse) {
  const mockSwitch = getFriendsMockSwitck();

  if (mockSwitch === FriendsMockSwitch.SLOW) {
    response.delay(3000);
  }

  switch (mockSwitch) {
    case FriendsMockSwitch.EMPTY:
      return {
        _embedded: [],
        _links: {},
      };
    case FriendsMockSwitch.LOADING_FAILURE:
      return response.mockError(true);
    default:
      const from = parseInt((query.from as string) ?? '0');
      const to = from + 5;
      return {
        _embedded: mockFriends.slice(from, to).map((friend) => ({
          ...friend,
          isFavorite: getFavorites().includes(friend.id),
          _links: {
            addToFavorite: {
              href: `/api/friends/${friend.id}/add-to-favorite`,
              method: 'POST',
            },
            removeFromFavorite: {
              href: `/api/friends/${friend.id}/remove-from-favorite`,
              method: 'POST',
            },
          },
        })),
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

function getFavorites(): string[] {
  return loadFromMockDB('friend-favories') ?? ['enrico', 'michelle'];
}

function setFavorites(favorites: string[]): void {
  saveInMockDB('friend-favories', favorites);
}

function addToFavorite({ params }: MockRequest, response: MockResponse) {
  switch (getMockSwitch('friends')) {
    case FriendsMockSwitch.PROCESSING_FAILURE:
      return response.mockError(true);
    default:
      setFavorites([...getFavorites(), params.id]);
  }
}

function removeFromFavorite({ params }: MockRequest, response: MockResponse) {
  switch (getMockSwitch('friends')) {
    case FriendsMockSwitch.PROCESSING_FAILURE:
      return response.mockError(true);
    default:
      setFavorites(getFavorites().filter((id) => id !== params.id));
  }
}
