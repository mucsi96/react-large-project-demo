import { getFriends } from './friends';
import mockFriends from './mockFriends';

describe('friends', () => {
  describe('getFriends', () => {
    it('fetches the list of friends', async () => {
      window.fetch = jest
        .fn()
        .mockResolvedValueOnce({ json: () => mockFriends });
      const friends = await getFriends();
      expect(window.fetch).toHaveBeenCalledWith('/friends');
      expect(friends).toMatchSnapshot();
    });
  });
});
