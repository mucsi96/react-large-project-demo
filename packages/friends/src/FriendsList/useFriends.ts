import { useApi } from 'core';
import { Friend, getFriends, processFriend, FriendActions } from 'friends-api';
import { useEffect, useReducer } from 'react';
import { friendsReducer } from './friendsReducer';
import { Notification } from './types';

export function useFriends(): {
  friends?: Friend[];
  isLoading: boolean;
  loadingErrorMessage?: string;
  loadMore?: () => void;
  isFavorite: (firend: Friend) => boolean;
  isProcessing: (firend: Friend) => boolean;
  addToFavorites: (friend: Friend) => void;
  removeFromFavorites: (friend: Friend) => void;
  notifications: Notification[];
} {
  const friends = useApi(getFriends);
  const processFriends = useApi(processFriend);
  const [state, dispatch] = useReducer(friendsReducer, {
    friends: [],
    favorites: [],
    processing: [],
    notifications: [],
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
    if (!processFriends.fetchArgs) {
      return;
    }

    const [friend, action] = processFriends.fetchArgs;
    const notificationKey = Date.now().toString();
    dispatch({
      type: processFriends.error ? 'PROCESSING_FAILED' : 'PROCESSING_SUCCEED',
      friend,
      action,
      notificationKey,
    });
    setTimeout(
      () => dispatch({ type: 'CLEAR_NOTIFICATION', key: notificationKey }),
      3000
    );
  }, [processFriends.data, processFriends.error, processFriends.fetchArgs]);

  return {
    friends: state.friends,
    isLoading: friends.isLoading,
    loadingErrorMessage:
      friends.error &&
      `${friends.error.response?.error?.message ?? ''} Status: ${
        friends.error.status ?? ''
      }`,
    loadMore:
      friends.data?._links.next &&
      (() => friends.fetch(friends.data?._links.next)),
    isFavorite: (friend: Friend) => state.favorites.includes(friend.id),
    isProcessing: (friend: Friend) => state.processing.includes(friend.id),
    addToFavorites: (friend: Friend) => {
      dispatch({ type: 'ADD_TO_FAVORITES', id: friend.id });
      processFriends.fetch(friend, FriendActions.ADD_TO_FAVORITE);
    },
    removeFromFavorites: (friend: Friend) => {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', id: friend.id });
      processFriends.fetch(friend, FriendActions.REMOVE_FROM_FAVORITE);
    },
    notifications: state.notifications,
  };
}
