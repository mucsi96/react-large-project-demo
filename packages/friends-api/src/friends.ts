import { ApiCaller } from 'core';
import { Friend, FriendsResponse, FriendActions } from './types';

export type GetFriendsOptions = {
  reference?: FriendsResponse;
  searchText?: string;
};

export async function getFriends(
  callApi: ApiCaller,
  { reference, searchText }: GetFriendsOptions = {}
): Promise<FriendsResponse> {
  const friends = (await callApi({
    href: reference?._links.next?.href ?? '/api/friends',
    ...(searchText && { queryParams: { searchText } }),
  })) as FriendsResponse;
  return friends;
}

export function hasMore(reference: FriendsResponse): boolean {
  return !!reference._links.next;
}

export type ProcessFriendOptions = {
  friend: Friend;
  action: FriendActions;
};

export async function processFriend(
  callApi: ApiCaller,
  { friend, action }: ProcessFriendOptions
): Promise<void> {
  const { href, method } = friend._links[action];
  await callApi({ href, method });
}
