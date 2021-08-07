import { ApiMethod } from 'core';

export type Link = {
  href: string;
  method?: ApiMethod;
};

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

export enum FriendActions {
  ADD_TO_FAVORITE = 'addToFavorite',
  REMOVE_FROM_FAVORITE = 'removeFromFavorite',
}
