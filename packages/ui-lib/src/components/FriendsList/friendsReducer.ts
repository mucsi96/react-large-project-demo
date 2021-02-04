import { FriendActions } from 'friends-api';
import { FriendsAction, FriendsState } from './types';

export function friendsReducer(
  state: FriendsState,
  action: FriendsAction
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
            notifications: [
              {
                key: action.notificationKey,
                message: `Adding ${action.friend.firstName} to favorite was not successful`,
              },
              ...state.notifications,
            ],
          };
        case FriendActions.REMOVE_FROM_FAVORITE:
          return {
            ...state,
            favorites: [...state.favorites, action.friend.id],
            processing: state.processing.filter(
              (id) => id !== action.friend.id
            ),
            notifications: [
              {
                key: action.notificationKey,
                message: `Removing ${action.friend.firstName} from favorite was not successful`,
              },
              ...state.notifications,
            ],
          };
        default:
          return state;
      }
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          ({ key }) => key !== action.key
        ),
      };
    default:
      return state;
  }
}
