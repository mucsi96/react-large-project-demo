import { registerApiMocks } from 'dev-tools';
import mockFriends from './mockFriends';

export enum FriendsMockSwitch {
  NORMAL = 'NORMAL',
  EMPTY = 'EMPTY',
  FAILURE = 'FAILURE',
  SLOW = 'SLOW',
}

let mockSwitch: FriendsMockSwitch = FriendsMockSwitch.NORMAL;

export function setFriendsMock(value: FriendsMockSwitch): void {
  mockSwitch = value;
}

export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/api/friends',
      callback: (_request, response) => {
        switch (mockSwitch) {
          case FriendsMockSwitch.EMPTY:
            return [];
          case FriendsMockSwitch.FAILURE:
            return response.mockError(true);
          case FriendsMockSwitch.SLOW:
            response.delay(5000);
            return mockFriends;
          default:
            return mockFriends;
        }
      },
    },
  ]);
}
