import { getFriends } from './friends';
import { setupApiMocks } from './setupApiMocks';

setupApiMocks();

describe('friends', () => {
  describe('getFriends', () => {
    test('fetches friends', async () => {
      const response = await getFriends();
      expect(response).toMatchSnapshot();
    });
  });
});
