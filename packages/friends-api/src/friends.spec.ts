import { fetchJSON } from 'core';
import { getFriends, hasMore, processFriend } from './friends';
import { FriendActions, FriendsResponse } from './types';

describe('friends', () => {
  describe('getFriends', () => {
    test('fetches friends', async () => {
      const friends = await getFriends(fetchJSON);
      expect(reduceImages(friends)).toMatchSnapshot();
    });

    test('fetches the next page of friends', async () => {
      const friends1 = await getFriends(fetchJSON);
      const friends2 = await getFriends(fetchJSON, { reference: friends1 });
      expect(reduceImages(friends2)).toMatchSnapshot();
    });

    test('returns no next link if there are no more friends', async () => {
      const friends1 = await getFriends(fetchJSON);
      const friends2 = await getFriends(fetchJSON, { reference: friends1 });
      const friends3 = await getFriends(fetchJSON, { reference: friends2 });
      expect(hasMore(friends3)).toBe(false);
    });

    test('searches for friend', async () => {
      const friends = await getFriends(fetchJSON, { searchText: 'ri' });
      expect(reduceImages(friends)).toMatchSnapshot();
    });
  });

  describe('processFriend', () => {
    test('adds friend to favorite', async () => {
      const friends = await getFriends(fetchJSON);
      await processFriend(fetchJSON, {
        friend: friends._embedded[1],
        action: FriendActions.ADD_TO_FAVORITE,
      });
      const processedFriends = await getFriends(fetchJSON);
      expect(processedFriends._embedded[1].isFavorite).toBe(true);
    });

    test('removes friend from favorite', async () => {
      const friends = await getFriends(fetchJSON);
      await processFriend(fetchJSON, {
        friend: friends._embedded[1],
        action: FriendActions.ADD_TO_FAVORITE,
      });
      await processFriend(fetchJSON, {
        friend: friends._embedded[1],
        action: FriendActions.REMOVE_FROM_FAVORITE,
      });
      const processedFriends = await getFriends(fetchJSON);
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
