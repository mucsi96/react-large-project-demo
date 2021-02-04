import { Friend, FriendsResponse } from 'friends-api';

type LoadFriendsAction = {
  type: 'LOAD_FRIENDS';
  payload: FriendsResponse;
};

export type FriendsAction = LoadFriendsAction;

export type FriendsState = {
  friends: Friend[];
};
