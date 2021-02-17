import { handleJSONResponse } from 'core';
import { Friend, FriendsResponse, FriendActions } from './types';

type Fetch = (url: string, options?: RequestInit) => Promise<Response>;

export function getFriends(
  fetch: Fetch,
  reference?: FriendsResponse
): Promise<FriendsResponse> {
  return handleJSONResponse<FriendsResponse>(
    fetch(reference?._links.next?.href ?? '/api/friends')
  );
}

export function hasMore(reference: FriendsResponse): boolean {
  return !!reference._links.next;
}

export async function processFriend(
  fetch: Fetch,
  friend: Friend,
  action: FriendActions
): Promise<void> {
  const { href, method = 'GET' } = friend._links[action];
  return handleJSONResponse<void>(fetch(href, { method }));
}
