import { FriendActions, getFriends, processFriend } from './friends';
import { setupApiMocks } from './setupApiMocks';

setupApiMocks();

describe('friends', () => {
  describe('getFriends', () => {
    it('fetches the list of friends', async () => {
      const friends = await getFriends();
      expect(
        friends.map((friend) => ({
          ...friend,
          image: friend.image.substring(friend.image.length - 100),
        }))
      ).toMatchSnapshot();
    });
  });

  describe('processFriend', () => {
    it('adds friend to favorite', async () => {
      const friends = await getFriends();
      await processFriend(friends[1], FriendActions.ADD_TO_FAVORITE);
      const processedFriends = await getFriends();
      expect(processedFriends[1].isFavorite).toBe(true);
    });
  });
});
