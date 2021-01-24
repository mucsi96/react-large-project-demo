import { registerApiMocks, getMockSwitch } from 'dev-tools';
import mockFriends from './mockFriends';

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
            return mockFriends;
          default:
            return mockFriends;
        }
      },
    },
  ]);
}
