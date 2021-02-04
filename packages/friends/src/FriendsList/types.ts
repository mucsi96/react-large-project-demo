import { Friend, FriendsResponse, FriendActions } from 'friends-api';

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

export type FriendsAction =
  | LoadFriendsAction
  | AddToFavoritesAction
  | RemoveFromFavoritesAction
  | ProcessingSucceedAction
  | ProcessingFailedAction
  | ClearNotificationAction;

export type Notification = { key: string; message: string };

export type FriendsState = {
  favorites: string[];
  friends: Friend[];
  processing: string[];
  notifications: Notification[];
};
