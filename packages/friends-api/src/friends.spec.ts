import { getFriends } from './friends';
import mockFriends from './mockFriends';

describe('friends', () => {
  describe('getFriends', () => {
    it('fetches the list of friends', async () => {
      window.fetch = jest
        .fn()
        .mockResolvedValueOnce({ json: () => mockFriends, ok: true });
      const friends = await getFriends();
      expect(window.fetch).toHaveBeenCalledWith('api/friends');
      expect(friends).toMatchSnapshot();
    });
  });
});
