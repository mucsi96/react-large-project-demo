import { useApi, Fetch } from 'core';
import { getFriends, processFriend, FriendActions, hasMore } from 'friends-api';
import { useEffect, useReducer } from 'react';
import { friendsReducer } from './friendsReducer';
import { Notification, Friend } from './types';

export function useFriends(
  fetch: Fetch
): {
  friends?: Friend[];
  isLoading: boolean;
  isEmpty: boolean;
  loadingErrorMessage?: string;
  loadMore?: () => void;
  addToFavorites: (friend: Friend) => void;
  removeFromFavorites: (friend: Friend) => void;
  notifications: Notification[];
} {
  const friends = useApi(fetch, getFriends);
  const processFriends = useApi(fetch, processFriend);
  const [state, dispatch] = useReducer(friendsReducer, {
    friends: [],
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
    isEmpty: !state.friends.length,
    loadingErrorMessage:
      friends.error &&
      `${friends.error.response?.error?.message ?? ''} Status: ${
        friends.error.status ?? ''
      }`,
    loadMore:
      friends.data && hasMore(friends.data)
        ? () => friends.fetch(friends.data)
        : undefined,
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
