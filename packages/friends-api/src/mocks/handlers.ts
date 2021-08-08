import {
  getMockApiDelay,
  getMockSwitch,
  loadFromMockDB,
  saveInMockDB,
  setMockSwitch,
} from 'mock-api';
import { rest } from 'msw';
import mockFriends from '../mockFriends';
import { FriendsResponse } from '../types';

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

function getFavorites(): string[] {
  return loadFromMockDB('friend-favories') ?? ['enrico', 'michelle'];
}

function setFavorites(favorites: string[]): void {
  saveInMockDB('friend-favories', favorites);
}

function getDelay() {
  const mockSwitch = getFriendsMockSwitck();

  if (mockSwitch === FriendsMockSwitch.SLOW) {
    return 3000;
  }

  return getMockApiDelay();
}

export const mockFriendHandlers = [
  rest.get('/api/friends', (req, res, ctx) => {
    switch (getFriendsMockSwitck()) {
      case FriendsMockSwitch.EMPTY:
        return res(
          ctx.status(200),
          ctx.delay(getDelay()),
          ctx.json({
            _embedded: [],
            _links: {},
          })
        );
      case FriendsMockSwitch.LOADING_FAILURE:
        return res(
          ctx.status(500),
          ctx.delay(getDelay()),
          ctx.json({
            error: { message: "We couldn't process your request at this time" },
          })
        );
      default:
        const from = parseInt(req.url.searchParams.get('from') ?? '0');
        const to = from + 5;
        return res(
          ctx.status(200),
          ctx.delay(getDelay()),
          ctx.json({
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
          } as FriendsResponse)
        );
    }
  }),
  rest.post('/api/friends/:id/add-to-favorite', (req, res, ctx) => {
    switch (getMockSwitch('friends')) {
      case FriendsMockSwitch.PROCESSING_FAILURE:
        return res(
          ctx.status(500),
          ctx.delay(getDelay()),
          ctx.json({
            error: { message: "We couldn't process your request at this time" },
          })
        );
      default:
        setFavorites([...getFavorites(), req.params.id]);
        return res(ctx.status(200), ctx.delay(getDelay()));
    }
  }),
  rest.post('/api/friends/:id/remove-from-favorite', (req, res, ctx) => {
    switch (getMockSwitch('friends')) {
      case FriendsMockSwitch.PROCESSING_FAILURE:
        return res(
          ctx.status(500),
          ctx.delay(getDelay()),
          ctx.json({
            error: { message: "We couldn't process your request at this time" },
          })
        );
      default:
        setFavorites(getFavorites().filter((id) => id !== req.params.id));
        return res(ctx.status(200), ctx.delay(getDelay()));
    }
  }),
];
