import { fetchJSON } from 'core';

type Link = {
  href: string;
  method?: string;
};

export enum FriendActions {
  ADD_TO_FAVORITE = 'addToFavorite',
  REMOVE_FROM_FAVORITE = 'removeFromFavorite',
}

export type Friend = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  isFavorite: boolean;
  _links: Record<FriendActions, Link>;
};

export type FriendsResponse = {
  _embedded: Friend[];
  _links: {
    next?: Link;
  };
};

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
