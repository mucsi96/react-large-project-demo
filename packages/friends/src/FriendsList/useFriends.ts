import { useApi } from 'core';
import { Friend, getFriends } from 'friends-api';
import { useEffect, useReducer } from 'react';
import { friendsReducer } from './friendsReducer';

export function useFriends(): {
  friends?: Friend[];
  isLoading: boolean;
  loadingErrorMessage?: string;
  loadMore?: () => void;
} {
  const friends = useApi(getFriends);
  const [state, dispatch] = useReducer(friendsReducer, {
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
  };
}
