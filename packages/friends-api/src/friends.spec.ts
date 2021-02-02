import { FriendActions, getFriends, processFriend } from './friends';
import { setupApiMocks } from './setupApiMocks';

setupApiMocks();

describe('friends', () => {
  describe('getFriends', () => {
    it('fetches the list of friends', async () => {
      const friends = await getFriends();
      expect({
        ...friends,
        _embedded: friends._embedded.map((friend) => ({
          ...friend,
          image: friend.image.substring(friend.image.length - 100),
        })),
      }).toMatchSnapshot();
    });
  });

  describe('processFriend', () => {
    it('adds friend to favorite', async () => {
      const friends = await getFriends();
      await processFriend(friends._embedded[1], FriendActions.ADD_TO_FAVORITE);
      const processedFriends = await getFriends();
      expect(processedFriends._embedded[1].isFavorite).toBe(true);
    });

    it('removes friend from favorite', async () => {
      const friends = await getFriends();
      await processFriend(friends._embedded[1], FriendActions.ADD_TO_FAVORITE);
      await processFriend(
        friends._embedded[1],
        FriendActions.REMOVE_FROM_FAVORITE
      );
      const processedFriends = await getFriends();
      expect(processedFriends._embedded[1].isFavorite).toBe(false);
    });
  });
});
