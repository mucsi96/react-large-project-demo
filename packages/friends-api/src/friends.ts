import { fetchJSON } from 'core';
import { Friend, FriendsResponse, Link, FriendActions } from './types';

export function getFriends(
  link: Link = { href: '/api/friends' }
): Promise<FriendsResponse> {
  return fetchJSON(link.href);
}

export async function processFriend(
  friend: Friend,
  action: FriendActions
): Promise<void> {
  const { href, method = 'GET' } = friend._links[action];
  await fetchJSON<void>(href, { method });
}
