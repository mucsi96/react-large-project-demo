import { registerApiMocks } from 'dev-tools';
import mockFriends from './mockFriends';

export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/api/friends',
      callback: () => {
        return mockFriends;
      },
    },
  ]);
}
