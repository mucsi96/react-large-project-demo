import { FriendActions } from 'friends-api';
import {
  FriendsState,
  AddToFavoritesAction,
  LoadFriendsAction,
  RemoveFromFavoritesAction,
  ProcessingSucceedAction,
  ProcessingFailedAction,
} from './types';

export function friendsReducer(
  state: FriendsState,
  action:
    | LoadFriendsAction
    | AddToFavoritesAction
    | RemoveFromFavoritesAction
    | ProcessingSucceedAction
    | ProcessingFailedAction
): FriendsState {
  switch (action.type) {
    case 'LOAD_FRIENDS':
      return {
        ...state,
        favorites: action.payload._embedded
          .filter(({ isFavorite }) => isFavorite)
          .map(({ id }) => id),
        friends: [...state.friends, ...action.payload._embedded],
      };
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        processing: [...state.processing, action.id],
        favorites: [...state.favorites, action.id],
      };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        processing: [...state.processing, action.id],
        favorites: state.favorites.filter((id) => id !== action.id),
      };
    case 'PROCESSING_SUCCEED':
      return {
        ...state,
        processing: state.processing.filter((id) => id !== action.friend.id),
      };
    case 'PROCESSING_FAILED':
      switch (action.action) {
        case FriendActions.ADD_TO_FAVORITE:
          return {
            ...state,
            favorites: state.favorites.filter((id) => id !== action.friend.id),
            processing: state.processing.filter(
              (id) => id !== action.friend.id
            ),
            lastProcessingError: 'Adding to favorite was not successful',
          };
        case FriendActions.REMOVE_FROM_FAVORITE:
          return {
            ...state,
            favorites: [...state.favorites, action.friend.id],
            processing: state.processing.filter(
              (id) => id !== action.friend.id
            ),
            lastProcessingError: 'Removing from favorite was not successful',
          };
        default:
          return state;
      }
    default:
      return state;
  }
}
