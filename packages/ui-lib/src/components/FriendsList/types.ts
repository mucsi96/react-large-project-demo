import { Friend, FriendsResponse } from 'friends-api';

export type LoadFriendsAction = {
  type: 'LOAD_FRIENDS';
  payload: FriendsResponse;
};

export type AddToFavoritesAction = {
  type: 'ADD_TO_FAVORITES';
  id: string;
};

export type RemoveFromFavoritesAction = {
  type: 'REMOVE_FROM_FAVORITES';
  id: string;
};

export type FriendsState = {
  favorites: string[];
  friends: Friend[];
};
