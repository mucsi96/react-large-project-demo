import { getFriends } from './friends';

const mockFriends = [
  { firstName: 'Alyson', lastName: 'Donnelly' },
  { firstName: 'Carlee', lastName: 'Kreiger' },
  { firstName: 'Enrico', lastName: 'Pouros' },
];

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
