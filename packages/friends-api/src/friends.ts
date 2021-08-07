import { ApiCaller } from 'core';
import { Friend, FriendsResponse, FriendActions } from './types';

export async function getFriends(
  callApi: ApiCaller,
  reference?: FriendsResponse
): Promise<FriendsResponse> {
  const friends = (await callApi({
    href: reference?._links.next?.href ?? '/api/friends',
  })) as FriendsResponse;
  return friends;
}

export function hasMore(reference: FriendsResponse): boolean {
  return !!reference._links.next;
}

export async function processFriend(
  callApi: ApiCaller,
  friend: Friend,
  action: FriendActions
): Promise<void> {
  const { href, method } = friend._links[action];
  await callApi({ href, method });
}
