import { registerApiMocks } from 'dev-tools';
import mockFriends from './mockFriends';

export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/friends',
      callback: (_request, _response) => {
        return mockFriends;
      },
    },
  ]);
}
