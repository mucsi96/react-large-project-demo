import { Friend, FriendActions, FriendsResponse } from 'friends-api';

export type Fetch = (url: string, options?: RequestInit) => Promise<Response>;

type LoadFriendsAction = {
  type: 'LOAD_FRIENDS';
  payload: FriendsResponse;
};

type AddToFavoritesAction = {
  type: 'ADD_TO_FAVORITES';
  id: string;
};

type RemoveFromFavoritesAction = {
  type: 'REMOVE_FROM_FAVORITES';
  id: string;
};

type ProcessingSucceedAction = {
  type: 'PROCESSING_SUCCEED';
  friend: Friend;
  action: FriendActions;
  notificationKey: string;
};

type ProcessingFailedAction = {
  type: 'PROCESSING_FAILED';
  friend: Friend;
  action: FriendActions;
  notificationKey: string;
};

type ClearNotificationAction = {
  type: 'CLEAR_NOTIFICATION';
  key: string;
};

type SearchAction = {
  type: 'SEARCH';
  text: string;
};

export type FriendsAction =
  | LoadFriendsAction
  | AddToFavoritesAction
  | RemoveFromFavoritesAction
  | ProcessingSucceedAction
  | ProcessingFailedAction
  | ClearNotificationAction
  | SearchAction;

export type Notification = { key: string; message: string };

export type FriendsState = {
  friends: Friend[];
  favorites: string[];
  processing: string[];
  notifications: Notification[];
  searchText: string;
};
