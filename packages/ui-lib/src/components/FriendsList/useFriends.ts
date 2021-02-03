import { useApi } from 'core';
import { Friend, FriendActions, getFriends, processFriend } from 'friends-api';
import { useEffect, useReducer } from 'react';
import { friendsReducer } from './friendsReducer';

export function useFriends(): {
  isLoading: boolean;
  isEmpty: boolean;
  loadingErrorMessage?: string;
  lastProcessingError?: string;
  loadMore?: () => void;
  friends: Friend[];
  isFavorite: (firend: Friend) => boolean;
  isProcessing: (firend: Friend) => boolean;
  addToFavorites: (friend: Friend) => void;
  removeFromFavorites: (friend: Friend) => void;
} {
  const friends = useApi(getFriends);
  const processFriends = useApi(processFriend);
  const [state, dispatch] = useReducer(friendsReducer, {
    favorites: [],
    friends: [],
    processing: [],
  });

  useEffect(() => {
    friends.fetch();
  }, [friends]);

  useEffect(() => {
    if (friends.data) {
      dispatch({ type: 'LOAD_FRIENDS', payload: friends.data });
    }
  }, [friends.data]);

  useEffect(() => {
    if (processFriends.error && processFriends.fetchArgs) {
      const [friend, action] = processFriends.fetchArgs;
      dispatch({
        type: 'PROCESSING_FAILED',
        friend,
        action,
      });
    }
  }, [processFriends.error, processFriends.fetchArgs]);

  useEffect(() => {
    if (processFriends.data && processFriends.fetchArgs) {
      const [friend, action] = processFriends.fetchArgs;
      dispatch({
        type: 'PROCESSING_SUCCEED',
        friend,
        action,
      });
    }
  }, [processFriends.data, processFriends.fetchArgs]);

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
    loadingErrorMessage:
      friends.error &&
      `${friends.error?.response?.error?.message || ''}. Status: ${
        friends.error?.status || ''
      }`,
    lastProcessingError: state.lastProcessingError,
    loadMore:
      friends.data?._links.next &&
      (() => friends.fetch(friends.data?._links.next)),
    friends: state.friends,
    isFavorite: (friend: Friend) => state.favorites.includes(friend.id),
    isProcessing: (friend: Friend) => state.processing.includes(friend.id),
    addToFavorites,
    removeFromFavorites,
  };
}
