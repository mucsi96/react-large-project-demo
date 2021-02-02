import {
  FriendsState,
  AddToFavoritesAction,
  LoadFriendsAction,
  RemoveFromFavoritesAction,
} from './types';

export function friendsReducer(
  state: FriendsState,
  action: LoadFriendsAction | AddToFavoritesAction | RemoveFromFavoritesAction
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
        favorites: [...state.favorites, action.id],
      };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.id),
      };
    default:
      return state;
  }
}
