import {
  registerApiMocks,
  getMockSwitch,
  getFromMockStorage,
  saveInMockStorage,
} from 'dev-tools';
import { FriendsResponse } from './friends';
import mockFriends from './mockFriends';

function getFavorites(): string[] {
  return getFromMockStorage('friend-favories') ?? [];
}

function setFavorites(favorites: string[]): void {
  saveInMockStorage('friend-favories', favorites);
}

function getPage(from?: string) {
  const index = mockFriends.findIndex(({ id }) => id === from);
  const fromIndex = index !== -1 ? index : 0;
  const toIndex = fromIndex + 5;
  const next = mockFriends[toIndex];
  const nextLink = next
    ? {
        href: `/api/friends?from=${next.id}`,
      }
    : undefined;
  return {
    fromIndex,
    toIndex,
    nextLink,
  };
}

function getFriends(from?: string): FriendsResponse {
  const { fromIndex, toIndex, nextLink } = getPage(from);

  return {
    _embedded: mockFriends.slice(fromIndex, toIndex).map((friend) => ({
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
      next: nextLink,
    },
  };
}

export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/api/friends',
      callback: ({ query }, response) => {
        switch (getMockSwitch('friends')) {
          case 'empty':
            return {
              _embedded: [],
              _links: {},
            };
          case 'failure':
            return response.mockError(true);
          case 'slow':
            response.delay(5000);
            return getFriends(query.from as string);
          default:
            return getFriends(query.from as string);
        }
      },
    },
    {
      path: '/api/friends/:id/add-to-favorite',
      method: 'POST',
      callback: ({ params }) => {
        setFavorites([...getFavorites(), params.id]);
      },
    },
    {
      path: '/api/friends/:id/remove-from-favorite',
      method: 'POST',
      callback: ({ params }) => {
        setFavorites(getFavorites().filter((id) => id !== params.id));
      },
    },
  ]);
}
