import { getFriends } from './friends';
import { setupApiMocks } from './setupApiMocks';
import { FriendsResponse } from './types';

setupApiMocks();

describe('friends', () => {
  describe('getFriends', () => {
    test('fetches friends', async () => {
      const friends = await getFriends();
      expect(reduceImages(friends)).toMatchSnapshot();
    });

    it('fetches the next page of friends', async () => {
      const friends1 = await getFriends();
      const friends2 = await getFriends(friends1._links.next);
      expect(reduceImages(friends2)).toMatchSnapshot();
    });

    it('returns no next link if there are no more friends', async () => {
      const friends1 = await getFriends();
      const friends2 = await getFriends(friends1._links.next);
      const friends3 = await getFriends(friends2._links.next);
      expect(friends3._links.next).toBeUndefined();
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
