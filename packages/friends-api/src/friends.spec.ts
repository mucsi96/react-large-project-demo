import { getFriends, hasMore, processFriend } from './friends';
import { setupApiMocks } from './setupApiMocks';
import { FriendActions, FriendsResponse } from './types';

setupApiMocks();

describe('friends', () => {
  describe('getFriends', () => {
    test('fetches friends', async () => {
      const friends = await getFriends();
      expect(reduceImages(friends)).toMatchSnapshot();
    });

    it('fetches the next page of friends', async () => {
      const friends1 = await getFriends();
      const friends2 = await getFriends(friends1);
      expect(reduceImages(friends2)).toMatchSnapshot();
    });

    it('returns no next link if there are no more friends', async () => {
      const friends1 = await getFriends();
      const friends2 = await getFriends(friends1);
      const friends3 = await getFriends(friends2);
      expect(hasMore(friends3)).toBe(false);
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

function reduceImages(friends: FriendsResponse): FriendsResponse {
  return {
    ...friends,
    _embedded: friends._embedded.map((friend) => ({
      ...friend,
      image: friend.image.substring(friend.image.length - 100),
    })),
  };
}
