import { FriendActions } from 'friends-api';
import { FriendsAction, FriendsState, Friend } from './types';

function updateFriend(
  state: FriendsState,
  id: string,
  update: Partial<Friend>
) {
  return {
    ...state,
    friends: state.friends.map((friend) => {
      if (friend.id !== id) {
        return friend;
      }

      return {
        ...friend,
        ...update,
      };
    }),
  };
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
      };
    case 'ADD_TO_FAVORITES':
      return updateFriend(state, action.id, {
        isFavorite: true,
        isProcessing: true,
      });
    case 'REMOVE_FROM_FAVORITES':
      return updateFriend(state, action.id, {
        isFavorite: false,
        isProcessing: true,
      });
    case 'PROCESSING_SUCCEED':
      return updateFriend(state, action.friend.id, {
        isProcessing: false,
      });
    case 'PROCESSING_FAILED':
      switch (action.action) {
        case FriendActions.ADD_TO_FAVORITE:
          return {
            ...updateFriend(state, action.friend.id, {
              isProcessing: false,
              isFavorite: false,
            }),
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
            ...updateFriend(state, action.friend.id, {
              isProcessing: false,
              isFavorite: true,
            }),
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
