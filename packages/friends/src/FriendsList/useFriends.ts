import { useApi, ApiCaller } from 'core';
import { getFriends, processFriend, FriendActions, hasMore } from 'friends-api';
import { useEffect, useReducer } from 'react';
import { friendsReducer } from './friendsReducer';
import { Notification, Friend } from './types';

export function useFriends(
  callApi: ApiCaller
): {
  friends?: Friend[];
  isLoading: boolean;
  isEmpty: boolean;
  loadingErrorMessage?: string;
  searchText: string;
  loadMore?: () => void;
  addToFavorites: (friend: Friend) => void;
  removeFromFavorites: (friend: Friend) => void;
  notifications: Notification[];
  search: (text: string) => void;
} {
  const friends = useApi(callApi, getFriends);
  const processFriends = useApi(callApi, processFriend, {
    noAbortOnSubsequentCall: true,
  });
  const [state, dispatch] = useReducer(friendsReducer, {
    friends: [],
    notifications: [],
    searchText: '',
  });

  useEffect(() => {
    friends.fetch({ searchText: state.searchText });
  }, [friends, state.searchText]);

  useEffect(() => {
    if (friends.data) {
      dispatch({ type: 'LOAD_FRIENDS', payload: friends.data });
    }
  }, [friends.data]);

  useEffect(() => {
    if (!processFriends.fetchArgs) {
      return;
    }

    const [{ friend, action }] = processFriends.fetchArgs;
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
    isEmpty: friends.data ? !state.friends.length : false,
    loadingErrorMessage:
      friends.error &&
      `${friends.error.response?.error?.message ?? ''} Status: ${
        friends.error.status ?? ''
      }`,
    searchText: state.searchText,
    loadMore:
      friends.data && hasMore(friends.data)
        ? () =>
            friends.fetch({
              reference: friends.data,
              searchText: state.searchText,
            })
        : undefined,
    addToFavorites: (friend: Friend) => {
      dispatch({ type: 'ADD_TO_FAVORITES', id: friend.id });
      processFriends.fetch({ friend, action: FriendActions.ADD_TO_FAVORITE });
    },
    removeFromFavorites: (friend: Friend) => {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', id: friend.id });
      processFriends.fetch({
        friend,
        action: FriendActions.REMOVE_FROM_FAVORITE,
      });
    },
    notifications: state.notifications,
    search: (text: string) => dispatch({ type: 'SEARCH', text }),
  };
}
