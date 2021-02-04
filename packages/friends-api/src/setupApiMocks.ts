import {
  getMockSwitch,
  registerApiMocks,
  MockRequest,
  MockResponse,
} from 'dev-tools';
import mockFriends from './mockFriends';

export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/api/friends',
      callback: getFriends,
    },
  ]);
}

function getFriends(_request: MockRequest, response: MockResponse) {
  switch (getMockSwitch('friends')) {
    case 'loadingFailure':
      return response.mockError(true);
    default:
      return mockFriends;
  }
}
