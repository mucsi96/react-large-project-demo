import { fetchJSON } from 'core';
import { Friend, FriendActions, FriendsResponse, Link } from './types';

export async function getFriends(
  next: Link = {
    href: '/api/friends',
  }
): Promise<FriendsResponse> {
  return await fetchJSON<FriendsResponse>(next.href);
}

export async function processFriend(
  friend: Friend,
  action: FriendActions
): Promise<void> {
  const { href, method = 'GET' } = friend._links[action];
  await fetchJSON<void>(href, { method });
}
