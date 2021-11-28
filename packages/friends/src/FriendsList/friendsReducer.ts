import { FriendActions } from 'friends-api';
import { FriendsAction, FriendsState } from './types';

function add<T>(list: T[], idToAdd: T): T[] {
  return [...list.filter((id) => id !== idToAdd), idToAdd];
}

function remove<T>(list: T[], idToRemove: T): T[] {
  return list.filter((id) => id !== idToRemove);
}

export function friendsReducer(
  state: FriendsState,
  action: FriendsAction
): FriendsState {
  switch (action.type) {
    case 'LOAD_FRIENDS':
      return {
        ...state,
        friends: [...state.friends, ...action.payload._embedded],
      }
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        processing: add(state.processing, action.id),
        favorites: add(state.favorites, action.id),
      };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        processing: add(state.processing, action.id),
        favorites: remove(state.favorites, action.id),
      };
    case 'PROCESSING_SUCCEED':
      return {
        ...state,
        processing: remove(state.processing, action.friend.id),
      };
    case 'PROCESSING_FAILED':
      switch (action.action) {
        case FriendActions.ADD_TO_FAVORITE:
          return {
            ...state,
            processing: remove(state.processing, action.friend.id),
            favorites: remove(state.favorites, action.friend.id),
            notifications: add(state.notifications, {
              key: action.notificationKey,
              message: `Adding ${action.friend.firstName} to favorite was not successful`,
            }),
          };
        case FriendActions.REMOVE_FROM_FAVORITE:
          return {
            ...state,
            processing: remove(state.processing, action.friend.id),
            favorites: add(state.favorites, action.friend.id),
            notifications: add(state.notifications, {
              key: action.notificationKey,
              message: `Removing ${action.friend.firstName} from favorite was not successful`,
            }),
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
    case 'SEARCH':
      return {
        ...state,
        searchText: action.text,
      };
    default:
      return state;
  }
}
