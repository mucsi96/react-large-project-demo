import { getFriends } from './friends';
import { setupApiMocks } from './setupApiMocks';

setupApiMocks();

describe('friends', () => {
  describe('getFriends', () => {
    it('fetches the list of friends', async () => {
      const friends = await getFriends();
      expect(friends).toMatchSnapshot();
    });
  });
});
