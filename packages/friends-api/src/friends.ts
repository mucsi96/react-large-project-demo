import { fetchJSON } from 'core';
import { Friend, FriendsResponse, FriendActions } from './types';

export function getFriends(
  reference?: FriendsResponse
): Promise<FriendsResponse> {
  return fetchJSON(reference?._links.next?.href ?? '/api/friends');
}

export function hasMore(reference: FriendsResponse): boolean {
  return !!reference._links.next;
}

export async function processFriend(
  friend: Friend,
  action: FriendActions
): Promise<void> {
  const { href, method = 'GET' } = friend._links[action];
  await fetchJSON<void>(href, { method });
}
