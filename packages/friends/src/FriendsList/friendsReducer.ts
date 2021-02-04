import { FriendsAction, FriendsState } from './types';

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
    default:
      return state;
  }
}
