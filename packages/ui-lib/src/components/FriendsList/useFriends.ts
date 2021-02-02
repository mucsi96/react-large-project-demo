import { ApiError, useApi } from 'core';
import { Friend, FriendActions, getFriends, processFriend } from 'friends-api';
import { useEffect, useReducer } from 'react';
import { friendsReducer } from './friendsReducer';

export function useFriends(): {
  isLoading: boolean;
  isEmpty: boolean;
  error?: ApiError;
  loadMore?: () => void;
  friends: Friend[];
  isFavorite: (firend: Friend) => boolean;
  addToFavorites: (friend: Friend) => void;
  removeFromFavorites: (friend: Friend) => void;
} {
  const friends = useApi(getFriends);
  const processFriends = useApi(processFriend);
  const [state, dispatch] = useReducer(friendsReducer, {
    favorites: [],
    friends: [],
  });

  useEffect(() => {
    friends.fetch();
  }, [friends]);

  useEffect(() => {
    if (friends.data) {
      dispatch({ type: 'LOAD_FRIENDS', payload: friends.data });
    }
  }, [friends.data]);

  function addToFavorites(friend: Friend) {
    dispatch({ type: 'ADD_TO_FAVORITES', id: friend.id });
    processFriends.fetch(friend, FriendActions.ADD_TO_FAVORITE);
  }

  function removeFromFavorites(friend: Friend) {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', id: friend.id });
    processFriends.fetch(friend, FriendActions.REMOVE_FROM_FAVORITE);
  }

  return {
    isLoading: friends.isLoading,
    isEmpty: !state.friends.length,
    error: friends.error,
    loadMore:
      friends.data?._links.next &&
      (() => friends.fetch(friends.data?._links.next)),
    friends: state.friends,
    isFavorite: (friend: Friend) => state.favorites.includes(friend.id),
    addToFavorites,
    removeFromFavorites,
  };
}
