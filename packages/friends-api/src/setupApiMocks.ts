import { registerApiMocks, getMockSwitch } from 'dev-tools';
import { Friend } from './friends';
import mockFriends from './mockFriends';

function getFavorites(): string[] {
  return JSON.parse(
    sessionStorage.getItem('friend-favories') || '[]'
  ) as string[];
}

function setFavorites(favorites: string[]): void {
  sessionStorage.setItem('friend-favories', JSON.stringify(favorites));
}

function getFriends(): Friend[] {
  return mockFriends.map((friend) => ({
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
  }));
}

export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/api/friends',
      callback: (_request, response) => {
        switch (getMockSwitch('friends')) {
          case 'empty':
            return [];
          case 'failure':
            return response.mockError(true);
          case 'slow':
            response.delay(5000);
            return getFriends();
          default:
            return getFriends();
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
