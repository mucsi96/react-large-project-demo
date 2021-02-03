import { Friend, FriendsResponse, FriendActions } from 'friends-api';

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

export type ProcessingSucceedAction = {
  type: 'PROCESSING_SUCCEED';
  friend: Friend;
  action: FriendActions;
};

export type ProcessingFailedAction = {
  type: 'PROCESSING_FAILED';
  friend: Friend;
  action: FriendActions;
};

export type FriendsState = {
  favorites: string[];
  friends: Friend[];
  processing: string[];
  lastProcessingError?: string;
};
