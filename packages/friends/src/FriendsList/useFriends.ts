import { ApiCaller, ApiResponse, useApi } from 'core';
import {
  Friend,
  FriendActions,
  FriendsResponse,
  getFriends,
  GetFriendsOptions,
  hasMore,
  processFriend,
} from 'friends-api';
import { useEffect, useReducer } from 'react';
import { friendsReducer } from './friendsReducer';
import { FriendsState, Notification } from './types';

export function useFriends(
  callApi: ApiCaller
): {
  friendsResponse: ApiResponse<
    [(GetFriendsOptions | undefined)?],
    FriendsResponse
  >;
  friends: Friend[];
  searchText: string;
  loadMore?: () => void;
  addToFavorites: (friend: Friend) => void;
  removeFromFavorites: (friend: Friend) => void;
  notifications: Notification[];
  search: (text: string) => void;
  isProcessing: (friend: Friend) => boolean;
  isFavorite: (friend: Friend) => boolean;
} {
  const [fetchFriends, friends] = useApi(callApi, getFriends);
  const [processFriends, processingResponse] = useApi(callApi, processFriend, {
    noAbortOnSubsequentCall: true,
  });
  const [state, dispatch] = useReducer(friendsReducer, {
    friends: [],
    notifications: [],
    searchText: '',
    favorites: [],
    processing: [],
  } as FriendsState);

  useEffect(() => {
    fetchFriends({ searchText: state.searchText });
  }, [fetchFriends, state.searchText]);

  useEffect(() => {
    if (friends.data) {
      dispatch({ type: 'LOAD_FRIENDS', payload: friends.data });
    }
  }, [friends.data]);

  useEffect(() => {
    if (!processingResponse.fetchArgs) {
      return;
    }

    const [{ friend, action }] = processingResponse.fetchArgs;
    const notificationKey = Date.now().toString();
    dispatch({
      type: processingResponse.error
        ? 'PROCESSING_FAILED'
        : 'PROCESSING_SUCCEED',
      friend,
      action,
      notificationKey,
    });
    const timeout = setTimeout(
      () => dispatch({ type: 'CLEAR_NOTIFICATION', key: notificationKey }),
      3000
    );
    return () => clearTimeout(timeout);
  }, [processingResponse.error, processingResponse.fetchArgs]);

  return {
    friendsResponse: friends,
    friends: state.friends,
    searchText: state.searchText,
    loadMore:
      friends.data && hasMore(friends.data)
        ? () =>
            fetchFriends({
              reference: friends.data,
              searchText: state.searchText,
            })
        : undefined,
    addToFavorites: (friend: Friend) => {
      dispatch({ type: 'ADD_TO_FAVORITES', id: friend.id });
      processFriends({ friend, action: FriendActions.ADD_TO_FAVORITE });
    },
    removeFromFavorites: (friend: Friend) => {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', id: friend.id });
      processFriends({
        friend,
        action: FriendActions.REMOVE_FROM_FAVORITE,
      });
    },
    notifications: state.notifications,
    search: (text: string) => dispatch({ type: 'SEARCH', text }),
    isProcessing: (friend: Friend) => state.processing.includes(friend.id),
    isFavorite: (friend: Friend) =>
      state.favorites.includes(friend.id) || friend.isFavorite,
  };
}
